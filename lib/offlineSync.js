/**
 * Setu Health — Offline-First Engine & Delta Sync Manager (§6, §8)
 * - Local-first persistence in browser LocalStorage / IndexedDB
 * - Idempotency Keys on all mutations
 * - Purpose-of-Use consent verification headers
 * - Conflict resolution rules with full audit trail
 * - Network mode simulation: 'online' | 'weak_2g' | 'offline'
 */

import {
  INITIAL_HOUSEHOLD,
  INITIAL_APPOINTMENTS,
  INITIAL_ESCALATIONS,
  INITIAL_FORUM_POSTS,
  FACILITIES,
  INITIAL_KPIS
} from "./setuData";

const STORAGE_KEYS = {
  HOUSEHOLD: "setu_household_v1",
  APPOINTMENTS: "setu_appointments_v1",
  ESCALATIONS: "setu_escalations_v1",
  FORUM_POSTS: "setu_forum_posts_v1",
  MUTATION_QUEUE: "setu_mutation_queue_v1",
  AUDIT_LOG: "setu_audit_log_v1",
  NETWORK_MODE: "setu_network_mode_v1",
  KPIS: "setu_kpis_v1"
};

// Safe browser storage helper
function getStorage(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
}

function setStorage(key, val) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.warn("Storage write error:", e);
  }
}

// Generate unique UUID / Idempotency Key (§6)
export function generateIdempotencyKey() {
  return "idem_" + Date.now().toString(36) + "_" + Math.random().toString(36).substring(2, 8);
}

// Initialize Local Store with Pilot Defaults if empty
export function initLocalStore() {
  if (typeof window === "undefined") return;
  if (!localStorage.getItem(STORAGE_KEYS.HOUSEHOLD)) {
    setStorage(STORAGE_KEYS.HOUSEHOLD, INITIAL_HOUSEHOLD);
  }
  if (!localStorage.getItem(STORAGE_KEYS.APPOINTMENTS)) {
    setStorage(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
  } else {
    const existing = getStorage(STORAGE_KEYS.APPOINTMENTS, []);
    if (existing.some((a) => a.facilityName && a.facilityName.includes("Bishunpur"))) {
      setStorage(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
    }
  }
  if (!localStorage.getItem(STORAGE_KEYS.ESCALATIONS)) {
    setStorage(STORAGE_KEYS.ESCALATIONS, INITIAL_ESCALATIONS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.FORUM_POSTS)) {
    setStorage(STORAGE_KEYS.FORUM_POSTS, INITIAL_FORUM_POSTS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.MUTATION_QUEUE)) {
    setStorage(STORAGE_KEYS.MUTATION_QUEUE, []);
  }
  if (!localStorage.getItem(STORAGE_KEYS.AUDIT_LOG)) {
    setStorage(STORAGE_KEYS.AUDIT_LOG, [
      {
        id: "audit-init",
        timestamp: new Date().toISOString(),
        action: "STORE_INIT",
        actor: "System / CHW Client",
        detail: "Initialized Setu offline store for Maharashtra pilot block"
      }
    ]);
  }
  if (!localStorage.getItem(STORAGE_KEYS.NETWORK_MODE)) {
    setStorage(STORAGE_KEYS.NETWORK_MODE, "online");
  }
  if (!localStorage.getItem(STORAGE_KEYS.KPIS)) {
    setStorage(STORAGE_KEYS.KPIS, INITIAL_KPIS);
  }
}

// Network Mode Get & Set (Online / Weak 2G / Offline Simulation)
export function getNetworkMode() {
  return getStorage(STORAGE_KEYS.NETWORK_MODE, "online");
}

export function setNetworkMode(mode) {
  setStorage(STORAGE_KEYS.NETWORK_MODE, mode);
  window.dispatchEvent(new CustomEvent("setu_network_change", { detail: { mode } }));
}

// Get Data Methods
export function getHousehold() {
  return getStorage(STORAGE_KEYS.HOUSEHOLD, INITIAL_HOUSEHOLD);
}

export function getAppointments() {
  return getStorage(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
}

export function getEscalations() {
  return getStorage(STORAGE_KEYS.ESCALATIONS, INITIAL_ESCALATIONS);
}

export function getForumPosts() {
  return getStorage(STORAGE_KEYS.FORUM_POSTS, INITIAL_FORUM_POSTS);
}

export function setForumPosts(posts) {
  setStorage(STORAGE_KEYS.FORUM_POSTS, posts);
  window.dispatchEvent(new CustomEvent("setu_forum_update", { detail: { posts } }));
}

export function getMutationQueue() {
  return getStorage(STORAGE_KEYS.MUTATION_QUEUE, []);
}

export function getAuditLog() {
  return getStorage(STORAGE_KEYS.AUDIT_LOG, []);
}

export function getKpis() {
  return getStorage(STORAGE_KEYS.KPIS, INITIAL_KPIS);
}

// Queue an Offline Mutation (§6, §8)
export function queueMutation({ entityType, action, payload, purposeOfUse = "care-coordination" }) {
  const queue = getMutationQueue();
  const idempotencyKey = generateIdempotencyKey();

  const mutation = {
    id: "mut-" + Date.now(),
    idempotencyKey,
    entityType,
    action,
    payload,
    purposeOfUse,
    createdAt: new Date().toISOString(),
    syncStatus: "pending"
  };

  queue.push(mutation);
  setStorage(STORAGE_KEYS.MUTATION_QUEUE, queue);

  // Apply immediately to local store (Local-First Architecture)
  applyMutationLocally(mutation);

  // Log in Audit Trail (§10)
  logAudit({
    action: `MUTATION_QUEUED_${entityType}_${action}`,
    actor: "Patient/CHW Local Client",
    detail: `Queued offline mutation with key: ${idempotencyKey} for purpose: ${purposeOfUse}`
  });

  window.dispatchEvent(new CustomEvent("setu_sync_update", { detail: { count: queue.length } }));

  // If online, auto trigger sync
  if (getNetworkMode() === "online") {
    syncPendingMutations();
  }

  return mutation;
}

// Apply Mutation Locally (Optimistic local-first UI)
function applyMutationLocally(mutation) {
  if (mutation.entityType === "Appointment") {
    const list = getAppointments();
    if (mutation.action === "CREATE") {
      list.push({ ...mutation.payload, syncStatus: "queued_locally" });
    } else if (mutation.action === "CANCEL") {
      const idx = list.findIndex((a) => a.id === mutation.payload.id);
      if (idx !== -1) list[idx].status = "cancelled";
    }
    setStorage(STORAGE_KEYS.APPOINTMENTS, list);
  } else if (mutation.entityType === "Escalation") {
    const list = getEscalations();
    if (mutation.action === "CREATE") {
      list.push(mutation.payload);
    }
    setStorage(STORAGE_KEYS.ESCALATIONS, list);
  } else if (mutation.entityType === "ForumPost") {
    const list = getForumPosts();
    if (mutation.action === "CREATE") {
      list.unshift(mutation.payload);
    } else if (mutation.action === "UPVOTE") {
      const found = list.find((p) => p.id === mutation.payload.id);
      if (found) found.upvotes = (found.upvotes || 0) + 1;
    } else if (mutation.action === "REPLY") {
      const found = list.find((p) => p.id === mutation.payload.postId);
      if (found) {
        if (!found.replies) found.replies = [];
        found.replies.push(mutation.payload.reply);
        found.repliesCount = found.replies.length;
      }
    } else if (mutation.action === "REPORT") {
      const found = list.find((p) => p.id === mutation.payload.id);
      if (found) {
        found.moderationStatus = "reported_under_review";
      }
    }
    setStorage(STORAGE_KEYS.FORUM_POSTS, list);
    window.dispatchEvent(new CustomEvent("setu_forum_update", { detail: { posts: list } }));
  }
}

// Automated Pre-Moderation & Red-Flag Escalation Engine (§11)
export function evaluateForumModeration(text) {
  const lower = (text || "").toLowerCase();

  const emergencyKeywords = [
    "bleeding", "blood", "soaking", "khoon", "haemorrhage", "hemorrhage",
    "chest pain", "breathless", "gasping", "seene me dard", "saans phool",
    "blurred vision", "pre-eclampsia", "seizure", "unconscious", "behosh",
    "infant fever", "baby cold", "baby fever", "bachhe ko tez bukhar", "suicide", "end life"
  ];

  const healthClaimKeywords = [
    "guaranteed cure", "100% cure cancer", "stop all medicines", "magical herb cures",
    "jadibooti", "don't go to doctor", "avoid hospital"
  ];

  const hasEmergency = emergencyKeywords.some((k) => lower.includes(k));
  if (hasEmergency) {
    return {
      status: "flagged_emergency",
      reason: "Emergency symptoms detected. Automatically escalated to Clinician Emergency Queue.",
      isEscalated: true
    };
  }

  const hasHealthClaim = healthClaimKeywords.some((k) => lower.includes(k));
  if (hasHealthClaim) {
    return {
      status: "pending_review",
      reason: "Health claim requires verification by certified ASHA / Clinician moderator.",
      isEscalated: false
    };
  }

  return {
    status: "approved",
    reason: "Passed automated safety filters.",
    isEscalated: false
  };
}

// Log Audit Entry (§10)
export function logAudit({ action, actor, detail }) {
  const logs = getAuditLog();
  logs.unshift({
    id: "aud-" + Date.now() + "-" + Math.random().toString(36).substring(2, 5),
    timestamp: new Date().toISOString(),
    action,
    actor,
    detail
  });
  setStorage(STORAGE_KEYS.AUDIT_LOG, logs.slice(0, 100)); // retain last 100 entries
}

// Trigger Sync of Pending Mutations (§6)
export async function syncPendingMutations() {
  const currentMode = getNetworkMode();
  if (currentMode === "offline") {
    return { success: false, reason: "Device in offline mode. Queued for reconnect." };
  }

  const queue = getMutationQueue();
  const pending = queue.filter((m) => m.syncStatus === "pending");
  if (pending.length === 0) {
    return { success: true, count: 0 };
  }

  // Simulate latency if on weak 2G
  const delayMs = currentMode === "weak_2g" ? 1800 : 300;
  await new Promise((r) => setTimeout(r, delayMs));

  // Sync each mutation via API / mock server reconciliation
  const updatedQueue = [...queue];
  let syncedCount = 0;

  for (const mut of pending) {
    try {
      // In production this calls POST /api/v1/sync with Idempotency-Key
      // Here we simulate successful reconciliation and conflict detection
      mut.syncStatus = "synced";
      syncedCount++;

      // Update local appointment status to 'synced'
      if (mut.entityType === "Appointment") {
        const appts = getAppointments();
        const found = appts.find((a) => a.id === mut.payload.id);
        if (found) found.syncStatus = "synced";
        setStorage(STORAGE_KEYS.APPOINTMENTS, appts);
      }
    } catch (e) {
      mut.syncStatus = "conflict";
      logAudit({
        action: "SYNC_CONFLICT",
        actor: "Sync Service",
        detail: `Conflict detected for mutation ${mut.idempotencyKey}: ${e.message}`
      });
    }
  }

  // Keep synced mutations in queue marked as synced or remove
  setStorage(STORAGE_KEYS.MUTATION_QUEUE, updatedQueue.filter((m) => m.syncStatus !== "synced"));

  logAudit({
    action: "BATCH_SYNC_SUCCESS",
    actor: "Background Delta Sync Engine",
    detail: `Synchronized ${syncedCount} offline mutations to regional server.`
  });

  window.dispatchEvent(new CustomEvent("setu_sync_update", { detail: { count: 0, syncedCount } }));
  return { success: true, syncedCount };
}
