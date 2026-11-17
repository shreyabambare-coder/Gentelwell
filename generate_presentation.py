# -*- coding: utf-8 -*-
"""
Gentelwell (Setu Health) - High-Impact Executive Presentation Generator
Bespoke Management Consulting Standard | Strict Zero-Blue Palette | High Information Density
"""
import sys
import os
import shutil
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def create_presentation():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # =========================================================================
    # EDITORIAL COLOR SYSTEM (STRICT ZERO-BLUE PALETTE)
    # Warm linen, deep forest moss, burnt ochre, and brick wine
    # =========================================================================
    BG_CANVAS        = RGBColor(250, 248, 245)  # #FAF8F5 Warm Linen Alabaster
    BG_DARK_HERO     = RGBColor(16, 40, 30)     # #10281E Deep Forest Monolith
    CARD_WHITE       = RGBColor(255, 255, 255)  # #FFFFFF Crisp Milk White
    CARD_SAND        = RGBColor(245, 241, 234)  # #F5F1EA Soft Warm Sand Tint
    CARD_SAGE        = RGBColor(238, 245, 240)  # #EEF5F0 Pale Botanical Sage Tint
    CARD_OCHRE       = RGBColor(253, 246, 238)  # #FDF6EE Warm Terracotta Peach Tint
    CARD_WINE        = RGBColor(253, 242, 242)  # #FDF2F2 Soft Wine Alert Tint
    CARD_CODE        = RGBColor(242, 238, 230)  # #F2EEE6 Code / Spec Box Linen

    BORDER_SUBTLE    = RGBColor(228, 222, 212)  # #E4DED4 Warm Hairline Border
    BORDER_MEDIUM    = RGBColor(208, 201, 190)  # #D0C9BE Defined Warm Border
    BORDER_SAGE      = RGBColor(190, 215, 200)  # #BED7C8 Soft Sage Accent Border
    BORDER_OCHRE     = RGBColor(235, 210, 185)  # #EBD2B9 Warm Clay Accent Border
    BORDER_WINE      = RGBColor(232, 196, 196)  # #E8C4C4 Wine Accent Border

    # Executive Accent Tones (Strictly Zero Blue!)
    FOREST_DEEP      = RGBColor(16, 68, 48)     # #104430 Deep British Forest Green
    FOREST_VIBRANT   = RGBColor(24, 98, 68)     # #186244 Rich Botanical Emerald
    WARM_OCHRE       = RGBColor(184, 90, 40)    # #B85A28 Burnt Terracotta Ochre
    GOLD_OCHRE       = RGBColor(195, 130, 50)   # #C38232 Warm Gold Accent
    DEEP_WINE        = RGBColor(140, 28, 38)    # #8C1C26 Deep Wine Red (Clinical Urgency)
    
    # Typography & Hierarchy
    INK_ONYX         = RGBColor(24, 26, 24)     # #181A18 Deep Onyx Charcoal (Headings)
    INK_BODY         = RGBColor(54, 58, 53)     # #363A35 Rich Soil Slate (Body text)
    INK_MUTED        = RGBColor(110, 114, 106)  # #6E726A Warm Taupe Gray (Secondary labels)
    INK_FAINT        = RGBColor(160, 163, 155)  # #A0A39B Subtle Footers & Trackers

    FONT_EDITORIAL   = "Georgia"
    FONT_SANS        = "Segoe UI"

    def set_slide_background(slide, color=BG_CANVAS):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = color
        bg.line.fill.background()
        return bg

    def add_top_navigation(slide, section_name, title, subtitle, slide_num):
        pill = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.36), Inches(3.6), Inches(0.28))
        pill.fill.solid()
        pill.fill.fore_color.rgb = CARD_SAGE
        pill.line.color.rgb = BORDER_SAGE
        pill.line.width = Pt(1.0)
        tf_p = pill.text_frame
        tf_p.word_wrap = False
        tf_p.margin_left = Inches(0.12)
        tf_p.margin_top = Inches(0.03)
        p_p = tf_p.paragraphs[0]
        p_p.text = section_name.upper()
        p_p.font.name = FONT_SANS
        p_p.font.size = Pt(9.0)
        p_p.font.bold = True
        p_p.font.color.rgb = FOREST_DEEP

        num_box = slide.shapes.add_textbox(Inches(10.5), Inches(0.36), Inches(2.033), Inches(0.28))
        tf_n = num_box.text_frame
        tf_n.margin_top = tf_n.margin_right = tf_n.margin_bottom = 0
        p_n = tf_n.paragraphs[0]
        p_n.alignment = PP_ALIGN.RIGHT
        p_n.text = f"KEYSTONE ARCHITECTURE | {slide_num:02d} / 10"
        p_n.font.name = FONT_SANS
        p_n.font.size = Pt(9.5)
        p_n.font.bold = True
        p_n.font.color.rgb = INK_MUTED

        tb_t = slide.shapes.add_textbox(Inches(0.8), Inches(0.70), Inches(11.733), Inches(0.55))
        tf_t = tb_t.text_frame
        tf_t.word_wrap = True
        tf_t.margin_left = tf_t.margin_right = tf_t.margin_top = tf_t.margin_bottom = 0
        p_t = tf_t.paragraphs[0]
        p_t.text = title
        p_t.font.name = FONT_EDITORIAL
        p_t.font.size = Pt(22)
        p_t.font.bold = True
        p_t.font.color.rgb = INK_ONYX

        tb_s = slide.shapes.add_textbox(Inches(0.8), Inches(1.28), Inches(11.733), Inches(0.36))
        tf_s = tb_s.text_frame
        tf_s.word_wrap = True
        tf_s.margin_left = tf_s.margin_right = tf_s.margin_top = tf_s.margin_bottom = 0
        p_s = tf_s.paragraphs[0]
        p_s.text = subtitle
        p_s.font.name = FONT_SANS
        p_s.font.size = Pt(11.5)
        p_s.font.color.rgb = INK_MUTED

        line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.72), Inches(11.733), Inches(0.015))
        line.fill.solid()
        line.fill.fore_color.rgb = BORDER_SUBTLE
        line.line.fill.background()

    # =========================================================================
    # SLIDE 1: EDITORIAL TITLE & POSITIONING HERO
    # =========================================================================
    s1 = prs.slides.add_slide(blank_layout)
    set_slide_background(s1, BG_CANVAS)

    # Left Feature Column: Deep Forest Monolith
    left_hero = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(0.7), Inches(5.2), Inches(6.1))
    left_hero.fill.solid()
    left_hero.fill.fore_color.rgb = BG_DARK_HERO
    left_hero.line.fill.background()

    tb_lh = s1.shapes.add_textbox(Inches(1.15), Inches(1.0), Inches(4.5), Inches(5.5))
    tf_lh = tb_lh.text_frame
    tf_lh.word_wrap = True
    tf_lh.margin_left = tf_lh.margin_right = tf_lh.margin_top = tf_lh.margin_bottom = 0

    p_badge = tf_lh.paragraphs[0]
    p_badge.text = "ACADEMIC CAPSTONE REVIEW | 2026"
    p_badge.font.name = FONT_SANS
    p_badge.font.size = Pt(10)
    p_badge.font.bold = True
    p_badge.font.color.rgb = GOLD_OCHRE
    p_badge.space_after = Pt(14)

    p_main = tf_lh.add_paragraph()
    p_main.text = "Gentelwell"
    p_main.font.name = FONT_EDITORIAL
    p_main.font.size = Pt(40)
    p_main.font.bold = True
    p_main.font.color.rgb = RGBColor(255, 255, 255)

    p_main_sub = tf_lh.add_paragraph()
    p_main_sub.text = "(Setu Health Platform)"
    p_main_sub.font.name = FONT_EDITORIAL
    p_main_sub.font.size = Pt(22)
    p_main_sub.font.italic = True
    p_main_sub.font.color.rgb = RGBColor(205, 225, 215)
    p_main_sub.space_after = Pt(20)

    p_thesis = tf_lh.add_paragraph()
    p_thesis.text = "An Integrated Online + Offline Rural Healthcare Platform"
    p_thesis.font.name = FONT_SANS
    p_thesis.font.size = Pt(14)
    p_thesis.font.bold = True
    p_thesis.font.color.rgb = RGBColor(255, 255, 255)
    p_thesis.space_after = Pt(10)

    p_desc = tf_lh.add_paragraph()
    p_desc.text = "Engineered for resilient, zero-exclusion clinical triage, offline vitals logging, and bidirectional synchronization across severe connectivity and hardware constraints in rural tribal belts."
    p_desc.font.name = FONT_SANS
    p_desc.font.size = Pt(11)
    p_desc.font.color.rgb = RGBColor(190, 200, 195)
    p_desc.space_after = Pt(36)

    p_dept = tf_lh.add_paragraph()
    p_dept.text = "DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING\nComprehensive Technical Review & Architecture Dossier\nPresenter: Final Year Capstone Project Committee"
    p_dept.font.name = FONT_SANS
    p_dept.font.size = Pt(9.5)
    p_dept.font.color.rgb = RGBColor(150, 165, 158)

    # Right Top Card: Pilot Context & Tribal Ground Reality
    rt_card = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.3), Inches(0.7), Inches(6.233), Inches(2.9))
    rt_card.fill.solid()
    rt_card.fill.fore_color.rgb = CARD_WHITE
    rt_card.line.color.rgb = BORDER_SUBTLE
    rt_card.line.width = Pt(1.0)

    strip_rt = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(6.3), Inches(0.7), Inches(6.233), Inches(0.06))
    strip_rt.fill.solid()
    strip_rt.fill.fore_color.rgb = WARM_OCHRE
    strip_rt.line.fill.background()

    tb_rt = s1.shapes.add_textbox(Inches(6.6), Inches(0.92), Inches(5.633), Inches(2.55))
    tf_rt = tb_rt.text_frame
    tf_rt.word_wrap = True
    tf_rt.margin_left = tf_rt.margin_right = tf_rt.margin_top = tf_rt.margin_bottom = 0

    p_rt_eye = tf_rt.paragraphs[0]
    p_rt_eye.text = "TARGET CONTEXT & PILOT GEOGRAPHY"
    p_rt_eye.font.name = FONT_SANS
    p_rt_eye.font.size = Pt(10)
    p_rt_eye.font.bold = True
    p_rt_eye.font.color.rgb = WARM_OCHRE
    p_rt_eye.space_after = Pt(4)

    p_rt_dist = tf_rt.add_paragraph()
    p_rt_dist.text = "Palghar  *  Mokhada  *  Jawhar  *  Pune Rural  *  Kolhapur"
    p_rt_dist.font.name = FONT_SANS
    p_rt_dist.font.size = Pt(13)
    p_rt_dist.font.bold = True
    p_rt_dist.font.color.rgb = INK_ONYX
    p_rt_dist.space_after = Pt(8)

    p_rt_body = tf_rt.add_paragraph()
    p_rt_body.text = "Deploying into primary health centers (PHCs) and sub-centers facing frequent 2G fallback, power outages, and cellular dead zones. Direct intervention for pregnant women, infants, and agricultural daily-wage workers."
    p_rt_body.font.name = FONT_SANS
    p_rt_body.font.size = Pt(10.5)
    p_rt_body.font.color.rgb = INK_BODY
    p_rt_body.space_after = Pt(10)

    # 3 Badges inside Top Right Card
    rt_badges = [
        ("100% Tribal Focus", CARD_OCHRE, WARM_OCHRE),
        ("Sub-Rs. 16,000 Devices", CARD_SAND, INK_ONYX),
        ("Patchy 2G & Dead Zones", CARD_WINE, DEEP_WINE)
    ]
    for b_idx, (b_txt, b_bg, b_fg) in enumerate(rt_badges):
        bx = Inches(6.6) + Inches(1.85) * b_idx
        b_shp = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, bx, Inches(2.95), Inches(1.75), Inches(0.38))
        b_shp.fill.solid()
        b_shp.fill.fore_color.rgb = b_bg
        b_shp.line.color.rgb = BORDER_SUBTLE
        b_shp.line.width = Pt(0.8)
        tf_b = b_shp.text_frame
        p_b = tf_b.paragraphs[0]
        p_b.alignment = PP_ALIGN.CENTER
        p_b.text = b_txt
        p_b.font.name = FONT_SANS
        p_b.font.size = Pt(8.5)
        p_b.font.bold = True
        p_b.font.color.rgb = b_fg

    # Right Bottom Card: Technical Rigor & Standards
    rb_card = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.3), Inches(3.85), Inches(6.233), Inches(2.95))
    rb_card.fill.solid()
    rb_card.fill.fore_color.rgb = CARD_WHITE
    rb_card.line.color.rgb = BORDER_SUBTLE
    rb_card.line.width = Pt(1.0)

    strip_rb = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(6.3), Inches(3.85), Inches(6.233), Inches(0.06))
    strip_rb.fill.solid()
    strip_rb.fill.fore_color.rgb = FOREST_DEEP
    strip_rb.line.fill.background()

    tb_rb = s1.shapes.add_textbox(Inches(6.6), Inches(4.08), Inches(5.633), Inches(2.6))
    tf_rb = tb_rb.text_frame
    tf_rb.word_wrap = True
    tf_rb.margin_left = tf_rb.margin_right = tf_rb.margin_top = tf_rb.margin_bottom = 0

    p_rb_eye = tf_rb.paragraphs[0]
    p_rb_eye.text = "TECHNICAL SPECIFICATION & STANDARDS COMPLIANCE"
    p_rb_eye.font.name = FONT_SANS
    p_rb_eye.font.size = Pt(10)
    p_rb_eye.font.bold = True
    p_rb_eye.font.color.rgb = FOREST_DEEP
    p_rb_eye.space_after = Pt(4)

    p_rb_specs = tf_rb.add_paragraph()
    p_rb_specs.text = "Offline-First PWA  |  HL7 FHIR R4  |  DPDP Act 2023  |  ABDM Sandbox"
    p_rb_specs.font.name = FONT_SANS
    p_rb_specs.font.size = Pt(13)
    p_rb_specs.font.bold = True
    p_rb_specs.font.color.rgb = INK_ONYX
    p_rb_specs.space_after = Pt(8)

    p_rb_body = tf_rb.add_paragraph()
    p_rb_body.text = "Architecture spans three hardware degradation tiers (PWA, USSD/SMS, Spoken IVR) backed by deterministic local IndexedDB persistence, Clinician Precedence conflict resolution, and grounded Medical RAG."
    p_rb_body.font.name = FONT_SANS
    p_rb_body.font.size = Pt(10.5)
    p_rb_body.font.color.rgb = INK_BODY
    p_rb_body.space_after = Pt(10)

    # 3 Badges inside Bottom Right Card
    rb_badges = [
        ("Next.js 16 + React 19", CARD_SAGE, FOREST_DEEP),
        ("HL7 FHIR R4 + LOINC", CARD_SAND, INK_ONYX),
        ("DPDP Statutory Guard", CARD_OCHRE, WARM_OCHRE)
    ]
    for b_idx, (b_txt, b_bg, b_fg) in enumerate(rb_badges):
        bx = Inches(6.6) + Inches(1.85) * b_idx
        b_shp = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, bx, Inches(6.15), Inches(1.75), Inches(0.38))
        b_shp.fill.solid()
        b_shp.fill.fore_color.rgb = b_bg
        b_shp.line.color.rgb = BORDER_SUBTLE
        b_shp.line.width = Pt(0.8)
        tf_b = b_shp.text_frame
        p_b = tf_b.paragraphs[0]
        p_b.alignment = PP_ALIGN.CENTER
        p_b.text = b_txt
        p_b.font.name = FONT_SANS
        p_b.font.size = Pt(8.5)
        p_b.font.bold = True
        p_b.font.color.rgb = b_fg

    s1.notes_slide.notes_text_frame.text = (
        "Slide 1 Speaking Notes:\n"
        "Welcome Sir. Today we present Gentelwell (Setu Health), an integrated online and offline "
        "digital health platform engineered specifically for low-connectivity rural ecosystems across Maharashtra.\n"
        "Our focus regions include Palghar, Mokhada, and Jawhar tribal belts where digital healthcare traditionally fails due to infrastructure limits.\n"
        "Unlike generic cloud-first portals, Setu Health is designed with local-first persistence, DPDP statutory compliance, and zero-exclusion hardware degradation."
    )

    # =========================================================================
    # SLIDE 2: THE GROUND REALITY VS ARCHITECTURAL RESPONSE
    # =========================================================================
    s2 = prs.slides.add_slide(blank_layout)
    set_slide_background(s2, BG_CANVAS)
    add_top_navigation(s2, "Problem Space & Strategic Imperative", "Executive Summary: The Rural Healthcare Ground Reality", "Addressing structural infrastructure failures with an engineered offline-first architectural response.", 2)

    left_c = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.92), Inches(5.7), Inches(3.85))
    left_c.fill.solid()
    left_c.fill.fore_color.rgb = CARD_OCHRE
    left_c.line.color.rgb = BORDER_OCHRE
    left_c.line.width = Pt(1.0)

    tb_lc = s2.shapes.add_textbox(Inches(1.08), Inches(2.10), Inches(5.14), Inches(3.5))
    tf_lc = tb_lc.text_frame
    tf_lc.word_wrap = True
    tf_lc.margin_left = tf_lc.margin_right = tf_lc.margin_top = tf_lc.margin_bottom = 0

    p_lhead = tf_lc.paragraphs[0]
    p_lhead.text = "Rural Failure Modes & Ground Barriers"
    p_lhead.font.name = FONT_EDITORIAL
    p_lhead.font.size = Pt(16)
    p_lhead.font.bold = True
    p_lhead.font.color.rgb = WARM_OCHRE
    p_lhead.space_after = Pt(12)

    fail_points = [
        ("01. Patchy 2G/EDGE & Complete Cellular Voids", "Fringe talukas operate on unstable network signals. Conventional cloud-first web portals crash or throw timeouts, freezing electronic patient registers."),
        ("02. Hardware Constraints & Low Digital Literacy", "Widespread use of sub-Rs. 16,000 smartphones with <= 2 GB RAM. Non-literate citizens require visual icon flows and local audio guidance in Marathi."),
        ("03. Delayed Clinical Escalation for Acute Risks", "Severe maternal distress, postpartum hemorrhages, and neonatal hypothermia are missed in the field without deterministic, automated triage gatekeepers.")
    ]
    for tag, desc in fail_points:
        p_item = tf_lc.add_paragraph()
        p_item.text = tag
        p_item.font.name = FONT_SANS
        p_item.font.size = Pt(11)
        p_item.font.bold = True
        p_item.font.color.rgb = INK_ONYX
        
        p_desc = tf_lc.add_paragraph()
        p_desc.text = desc
        p_desc.font.name = FONT_SANS
        p_desc.font.size = Pt(10)
        p_desc.font.color.rgb = INK_BODY
        p_desc.space_after = Pt(10)

    right_c = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.833), Inches(1.92), Inches(5.7), Inches(3.85))
    right_c.fill.solid()
    right_c.fill.fore_color.rgb = CARD_SAGE
    right_c.line.color.rgb = BORDER_SAGE
    right_c.line.width = Pt(1.0)

    tb_rc = s2.shapes.add_textbox(Inches(7.113), Inches(2.10), Inches(5.14), Inches(3.5))
    tf_rc = tb_rc.text_frame
    tf_rc.word_wrap = True
    tf_rc.margin_left = tf_rc.margin_right = tf_rc.margin_top = tf_rc.margin_bottom = 0

    p_rhead = tf_rc.paragraphs[0]
    p_rhead.text = "Our Engineered Architectural Response"
    p_rhead.font.name = FONT_EDITORIAL
    p_rhead.font.size = Pt(16)
    p_rhead.font.bold = True
    p_rhead.font.color.rgb = FOREST_DEEP
    p_rhead.space_after = Pt(12)

    sol_points = [
        ("01. Offline-First Synchronous Store", "Local device IndexedDB serves as the primary master. Vitals and triage entries commit locally in 0ms before opportunistic background delta sync."),
        ("02. Three-Tier Graceful Degradation", "Zero exclusion: Full PWA on smartphones, automated 2-way SMS (56767) & USSD (*999#) on feature phones, and vernacular IVR voice hotlines."),
        ("03. Deterministic Safety & Statutory Compliance", "Hard-coded clinical red flags bypass AI to trigger 102/112 emergency routing. Full compliance with DPDP Act 2023 and HL7 FHIR R4 schemas.")
    ]
    for tag, desc in sol_points:
        p_item = tf_rc.add_paragraph()
        p_item.text = tag
        p_item.font.name = FONT_SANS
        p_item.font.size = Pt(11)
        p_item.font.bold = True
        p_item.font.color.rgb = INK_ONYX
        
        p_desc = tf_rc.add_paragraph()
        p_desc.text = desc
        p_desc.font.name = FONT_SANS
        p_desc.font.size = Pt(10)
        p_desc.font.color.rgb = INK_BODY
        p_desc.space_after = Pt(10)

    # Bottom 3 Stat Metric Pillars
    metrics = [
        ("30 - 50 kbps", "2G/EDGE Tolerance", "Optimized payload projection filters strip up to 75% overhead.", FOREST_DEEP, CARD_WHITE, Inches(0.8)),
        ("100% Offline", "Core Local Execution", "ASHA vitals entry and emergency triage operate with zero signal.", WARM_OCHRE, CARD_WHITE, Inches(4.833)),
        ("0.0% Misses", "Acute Emergency Target", "Deterministic hard-coded rules bypass AI to alert 102/112.", DEEP_WINE, CARD_WHITE, Inches(8.866))
    ]
    for big_txt, label, subtext, color_accent, card_bg, left_x in metrics:
        mb = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left_x, Inches(5.95), Inches(3.666), Inches(1.18))
        mb.fill.solid()
        mb.fill.fore_color.rgb = card_bg
        mb.line.color.rgb = BORDER_SUBTLE
        mb.line.width = Pt(1.0)

        astripe = s2.shapes.add_shape(MSO_SHAPE.RECTANGLE, left_x, Inches(5.95), Inches(0.06), Inches(1.18))
        astripe.fill.solid()
        astripe.fill.fore_color.rgb = color_accent
        astripe.line.fill.background()

        tb_m = s2.shapes.add_textbox(left_x + Inches(0.20), Inches(6.05), Inches(3.35), Inches(1.0))
        tf_m = tb_m.text_frame
        tf_m.word_wrap = True
        tf_m.margin_left = tf_m.margin_right = tf_m.margin_top = tf_m.margin_bottom = 0

        p_b = tf_m.paragraphs[0]
        p_b.text = big_txt
        p_b.font.name = FONT_EDITORIAL
        p_b.font.size = Pt(22)
        p_b.font.bold = True
        p_b.font.color.rgb = color_accent

        p_l = tf_m.add_paragraph()
        p_l.text = label
        p_l.font.name = FONT_SANS
        p_l.font.size = Pt(10.5)
        p_l.font.bold = True
        p_l.font.color.rgb = INK_ONYX

        p_sub = tf_m.add_paragraph()
        p_sub.text = subtext
        p_sub.font.name = FONT_SANS
        p_sub.font.size = Pt(9)
        p_sub.font.color.rgb = INK_MUTED

    s2.notes_slide.notes_text_frame.text = (
        "Slide 2 Speaking Notes:\n"
        "Traditional digital healthcare portals assume constant 4G/5G connections and high-end smartphones.\n"
        "In rural Maharashtra, this creates an exclusion barrier. Gentelwell flips the script: local storage comes first, "
        "and zero-exclusion degradation ensures feature phone users are never left behind."
    )

    # =========================================================================
    # SLIDE 3: THREE-TIER GRACEFUL DEGRADATION ARCHITECTURE
    # =========================================================================
    s3 = prs.slides.add_slide(blank_layout)
    set_slide_background(s3, BG_CANVAS)
    add_top_navigation(s3, "System Accessibility & Equity", "Three-Tier Graceful Degradation Strategy", "Matching citizen hardware capabilities from smartphones down to basic voice telephony.", 3)

    tiers = [
        {
            "tier_num": "TIER 01",
            "tier_title": "Smartphone PWA (Progressive Web App)",
            "device": "Android Smartphone (<= 2 GB RAM)",
            "network": "Offline-First | 2G/3G/4G/Wi-Fi Sync",
            "persona": "ASHA Workers, ANMs, PHC Staff",
            "stack": "Next.js 16, React 19, Service Worker, IndexedDB",
            "capabilities": "Rich visual UI, cached Marathi training videos, guided medical RAG triage, LOINC vitals tracking.",
            "badge_bg": CARD_SAGE,
            "badge_color": FOREST_DEEP,
            "accent": FOREST_DEEP,
            "y": Inches(1.92),
            "h": Inches(1.52)
        },
        {
            "tier_num": "TIER 02",
            "tier_title": "Feature Phone Accessibility (SMS & USSD)",
            "device": "Basic 2G Handset (Nokia 105, JioBharat)",
            "network": "Cellular Signaling Only (Zero Data Plan)",
            "persona": "Elderly Villagers, Agricultural Laborers",
            "stack": "Telco Shortcode Gateway 56767, USSD *999# Tree",
            "capabilities": "Menu-driven USSD booking, 2-way SMS keyword triage ('BOOK ANC', 'TRIAGE FEVER'), automated queue SMS.",
            "badge_bg": CARD_OCHRE,
            "badge_color": WARM_OCHRE,
            "accent": WARM_OCHRE,
            "y": Inches(3.60),
            "h": Inches(1.52)
        },
        {
            "tier_num": "TIER 03",
            "tier_title": "Spoken Voice Hotline (Interactive Voice Response)",
            "device": "Any Voice Handset or Landline Phone",
            "network": "Standard PSTN Voice Telephone Network",
            "persona": "Non-Literate Citizens, Maternal Callers",
            "stack": "PSTN Trunk, Vernacular STT/TTS Marathi/Hindi",
            "capabilities": "Conversational spoken triage, automated token booking, instantaneous acute ambulance dispatch to 102/112.",
            "badge_bg": CARD_SAND,
            "badge_color": INK_ONYX,
            "accent": GOLD_OCHRE,
            "y": Inches(5.28),
            "h": Inches(1.52)
        }
    ]

    for t in tiers:
        tc = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), t["y"], Inches(11.733), t["h"])
        tc.fill.solid()
        tc.fill.fore_color.rgb = CARD_WHITE
        tc.line.color.rgb = BORDER_SUBTLE
        tc.line.width = Pt(1.0)

        l_accent = s3.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), t["y"], Inches(0.08), t["h"])
        l_accent.fill.solid()
        l_accent.fill.fore_color.rgb = t["accent"]
        l_accent.line.fill.background()

        bp = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.15), t["y"] + Inches(0.16), Inches(1.15), Inches(0.28))
        bp.fill.solid()
        bp.fill.fore_color.rgb = t["badge_bg"]
        bp.line.fill.background()
        tf_bp = bp.text_frame
        p_bp = tf_bp.paragraphs[0]
        p_bp.alignment = PP_ALIGN.CENTER
        p_bp.text = t["tier_num"]
        p_bp.font.name = FONT_SANS
        p_bp.font.size = Pt(9.5)
        p_bp.font.bold = True
        p_bp.font.color.rgb = t["badge_color"]

        tb_tt = s3.shapes.add_textbox(Inches(2.45), t["y"] + Inches(0.12), Inches(9.8), Inches(0.35))
        tf_tt = tb_tt.text_frame
        p_tt = tf_tt.paragraphs[0]
        p_tt.text = t["tier_title"]
        p_tt.font.name = FONT_EDITORIAL
        p_tt.font.size = Pt(15)
        p_tt.font.bold = True
        p_tt.font.color.rgb = INK_ONYX

        # 4 Mini Spec Blocks inside each tier card
        spec_cols = [
            ("HARDWARE PROFILE", t["device"]),
            ("NETWORK CHANNEL", t["network"]),
            ("PRIMARY PERSONA", t["persona"]),
            ("CORE ARCHITECTURE", t["stack"])
        ]
        col_w = Inches(2.70)
        for c_idx, (c_lbl, c_val) in enumerate(spec_cols):
            cx = Inches(1.15) + Inches(2.78) * c_idx
            tb_sc = s3.shapes.add_textbox(cx, t["y"] + Inches(0.50), col_w, Inches(0.48))
            tf_sc = tb_sc.text_frame
            tf_sc.word_wrap = True
            tf_sc.margin_left = tf_sc.margin_right = tf_sc.margin_top = tf_sc.margin_bottom = 0
            
            p_sl = tf_sc.paragraphs[0]
            p_sl.text = c_lbl
            p_sl.font.name = FONT_SANS
            p_sl.font.size = Pt(8.0)
            p_sl.font.bold = True
            p_sl.font.color.rgb = t["accent"]

            p_sv = tf_sc.add_paragraph()
            p_sv.text = c_val
            p_sv.font.name = FONT_SANS
            p_sv.font.size = Pt(9.5)
            p_sv.font.color.rgb = INK_BODY

        # Capabilities banner inside the card
        tb_cap = s3.shapes.add_textbox(Inches(1.15), t["y"] + Inches(1.04), Inches(11.1), Inches(0.38))
        tf_cap = tb_cap.text_frame
        tf_cap.word_wrap = True
        tf_cap.margin_left = tf_cap.margin_right = tf_cap.margin_top = tf_cap.margin_bottom = 0
        p_cp = tf_cap.paragraphs[0]
        r_cpl = p_cp.add_run()
        r_cpl.text = "Key Capabilities: "
        r_cpl.font.name = FONT_SANS
        r_cpl.font.size = Pt(9.5)
        r_cpl.font.bold = True
        r_cpl.font.color.rgb = INK_ONYX

        r_cpv = p_cp.add_run()
        r_cpv.text = t["capabilities"]
        r_cpv.font.name = FONT_SANS
        r_cpv.font.size = Pt(9.5)
        r_cpv.font.color.rgb = INK_BODY

    s3.notes_slide.notes_text_frame.text = (
        "Slide 3 Speaking Notes:\n"
        "Notice the intentional hardware-adaptive hierarchy: We don't force smartphones on people who only have feature phones.\n"
        "Tier 1 handles rich PWA interactions for ASHA workers. Tier 2 provides USSD and SMS menus without internet. "
        "Tier 3 serves illiterate or emergency callers via spoken vernacular IVR."
    )

    # =========================================================================
    # SLIDE 4: HIGH-LEVEL SYSTEM ARCHITECTURE PIPELINE
    # =========================================================================
    s4 = prs.slides.add_slide(blank_layout)
    set_slide_background(s4, BG_CANVAS)
    add_top_navigation(s4, "Technical Topology & Data Flow", "High-Level System Architecture & Security Perimeter", "End-to-end technical pipeline spanning multi-channel ingestion, statutory DPDP boundary, and local persistence.", 4)

    pipeline_stages = [
        {
            "num": "STAGE 01",
            "name": "Edge Ingestion Layer",
            "accent": FOREST_DEEP,
            "bg": CARD_WHITE,
            "items": [
                ("PWA Client", "Next.js 16 / React 19 Service Worker with asset precaching and offline fallback."),
                ("SMS/USSD Gateway", "Ingests keyword queries via shortcode 56767 & *999# session navigation."),
                ("Voice IVR Gateway", "PSTN audio routing with Marathi & Hindi speech recognition pipelines."),
                ("Network Telemetry", "Monitors battery health, signal strength, and local storage quota.")
            ]
        },
        {
            "num": "STAGE 02",
            "name": "Security Perimeter",
            "accent": WARM_OCHRE,
            "bg": CARD_WHITE,
            "items": [
                ("DPDP Gatekeeper", "Strict reverse proxy enforces mandatory 'X-Purpose-Of-Use' header verification."),
                ("Transport Security", "TLS 1.3 cryptographic tunneling enforced across all web & API payloads."),
                ("Idempotency Filter", "Deduplicates retried mutation payloads during flaky 2G network retries."),
                ("Low-Literacy Auth", "Icon-based PIN token generator for community health workers in the field.")
            ]
        },
        {
            "num": "STAGE 03",
            "name": "Clinical & RAG Core",
            "accent": DEEP_WINE,
            "bg": CARD_WHITE,
            "items": [
                ("REST v1 API", "Versioned JSON contracts with ?compact=true 75% payload projection."),
                ("Emergency Bypass", "Deterministic regex red-flag engine routing straight to 102/112 ambulance."),
                ("Medical RAG", "Vector similarity retrieval over Mayo Clinic & NCCN peer-reviewed protocols."),
                ("FHIR Normalizer", "Transforms input payloads into HL7 FHIR R4 standard schema models.")
            ]
        },
        {
            "num": "STAGE 04",
            "name": "Persistence & Sync Engine",
            "accent": FOREST_VIBRANT,
            "bg": CARD_WHITE,
            "items": [
                ("Local IndexedDB", "Synchronous zero-latency writes on physical device storage first."),
                ("Delta Mutation Queue", "Queued mutations flush automatically upon browser online event detection."),
                ("Conflict Engine", "Deterministic Clinician Precedence rule arbitration on record collisions."),
                ("DPDP Audit Ledger", "Immutable statutory audit trail of all clinical disclosures and syncs.")
            ]
        }
    ]

    col_w = Inches(2.72)
    col_gap = Inches(0.28)
    start_x = Inches(0.8)

    for i, stg in enumerate(pipeline_stages):
        x = start_x + (col_w + col_gap) * i

        c = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(1.92), col_w, Inches(4.38))
        c.fill.solid()
        c.fill.fore_color.rgb = stg["bg"]
        c.line.color.rgb = BORDER_SUBTLE
        c.line.width = Pt(1.0)

        tstrip = s4.shapes.add_shape(MSO_SHAPE.RECTANGLE, x, Inches(1.92), col_w, Inches(0.06))
        tstrip.fill.solid()
        tstrip.fill.fore_color.rgb = stg["accent"]
        tstrip.line.fill.background()

        tb_c = s4.shapes.add_textbox(x + Inches(0.18), Inches(2.08), col_w - Inches(0.36), Inches(4.1))
        tf_c = tb_c.text_frame
        tf_c.word_wrap = True
        tf_c.margin_left = tf_c.margin_right = tf_c.margin_top = tf_c.margin_bottom = 0

        p_num = tf_c.paragraphs[0]
        p_num.text = stg["num"]
        p_num.font.name = FONT_SANS
        p_num.font.size = Pt(9.5)
        p_num.font.bold = True
        p_num.font.color.rgb = stg["accent"]
        p_num.space_after = Pt(2)

        p_name = tf_c.add_paragraph()
        p_name.text = stg["name"]
        p_name.font.name = FONT_EDITORIAL
        p_name.font.size = Pt(13.5)
        p_name.font.bold = True
        p_name.font.color.rgb = INK_ONYX
        p_name.space_after = Pt(10)

        for item_title, item_desc in stg["items"]:
            pi = tf_c.add_paragraph()
            pi.text = "*  " + item_title
            pi.font.name = FONT_SANS
            pi.font.size = Pt(10)
            pi.font.bold = True
            pi.font.color.rgb = INK_ONYX

            pd = tf_c.add_paragraph()
            pd.text = item_desc
            pd.font.name = FONT_SANS
            pd.font.size = Pt(9.2)
            pd.font.color.rgb = INK_BODY
            pd.space_after = Pt(6)

        if i < 3:
            arrow = s4.shapes.add_textbox(x + col_w, Inches(3.9), col_gap, Inches(0.5))
            tf_a = arrow.text_frame
            p_a = tf_a.paragraphs[0]
            p_a.alignment = PP_ALIGN.CENTER
            p_a.text = "->"
            p_a.font.name = FONT_SANS
            p_a.font.size = Pt(14)
            p_a.font.bold = True
            p_a.font.color.rgb = WARM_OCHRE

    gbar = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(6.45), Inches(11.733), Inches(0.68))
    gbar.fill.solid()
    gbar.fill.fore_color.rgb = CARD_SAGE
    gbar.line.color.rgb = BORDER_SAGE
    gbar.line.width = Pt(1.0)

    tb_g = s4.shapes.add_textbox(Inches(1.05), Inches(6.52), Inches(11.2), Inches(0.55))
    tf_g = tb_g.text_frame
    tf_g.word_wrap = True
    p_gb = tf_g.paragraphs[0]
    p_gb.text = "RESILIENCE & PRIVACY PRINCIPLE: Physical device local storage operates autonomously without network dependency. When connectivity awakens, requests pass through cryptographic DPDP purpose verification before mutating the central ABDM FHIR ledger."
    p_gb.font.name = FONT_SANS
    p_gb.font.size = Pt(9.5)
    p_gb.font.bold = True
    p_gb.font.color.rgb = FOREST_DEEP

    s4.notes_slide.notes_text_frame.text = (
        "Slide 4 Speaking Notes:\n"
        "Walk through the 4 architectural layers left to right: Access Channels feed into a strict DPDP Act compliance boundary, "
        "processed by our REST v1 & Clinical NLP pipeline, backed by our Local-First deterministic sync engine."
    )

    # =========================================================================
    # SLIDE 5: OFFLINE SYNCHRONIZATION & CONFLICT RESOLUTION ENGINE
    # =========================================================================
    s5 = prs.slides.add_slide(blank_layout)
    set_slide_background(s5, BG_CANVAS)
    add_top_navigation(s5, "Data Synchronization Architecture", "Offline-First Synchronization & Conflict Engine", "Deterministic synchronization pipeline ensuring zero clinical record loss across spotty connectivity.", 5)

    c5_l = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.92), Inches(5.7), Inches(5.20))
    c5_l.fill.solid()
    c5_l.fill.fore_color.rgb = CARD_WHITE
    c5_l.line.color.rgb = BORDER_SUBTLE
    c5_l.line.width = Pt(1.0)

    strip_5l = s5.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.92), Inches(5.7), Inches(0.06))
    strip_5l.fill.solid()
    strip_5l.fill.fore_color.rgb = FOREST_DEEP
    strip_5l.line.fill.background()

    tb_5l = s5.shapes.add_textbox(Inches(1.05), Inches(2.10), Inches(5.2), Inches(4.85))
    tf_5l = tb_5l.text_frame
    tf_5l.word_wrap = True
    tf_5l.margin_left = tf_5l.margin_right = tf_5l.margin_top = tf_5l.margin_bottom = 0

    p_5lt = tf_5l.paragraphs[0]
    p_5lt.text = "Local-First Mutation Lifecycle"
    p_5lt.font.name = FONT_EDITORIAL
    p_5lt.font.size = Pt(16)
    p_5lt.font.bold = True
    p_5lt.font.color.rgb = FOREST_DEEP
    p_5lt.space_after = Pt(12)

    l_steps = [
        ("Step 1: Optimistic Local Storage Commit", "All patient encounters, vitals entries, and triage forms write synchronously to device IndexedDB first. The user interface updates instantaneously with 0ms delay, shielding the user from network uncertainty."),
        ("Step 2: Deterministic Idempotency Key Tagging", "Each queued mutation receives a client-generated UUID header ('idem_<timestamp>_<uuid>'). Repeated network retry attempts over dropping 2G connections never duplicate patient records."),
        ("Step 3: Reactive Delta Queue Background Flush", "Mutations remain safely stored in local IndexedDB. A native browser 'online' event listener awakens the sync background worker to batch-send mutations to /api/v1/sync without requiring manual refreshes."),
        ("Step 4: Compact Gzip Delta Payload (<15 KB)", "Sync payloads bundle batched deltas with gzip compression and projection filters, consuming less than 15 KB of data even after an entire day of field consultations across village sub-centers.")
    ]
    for step_title, step_desc in l_steps:
        p_st = tf_5l.add_paragraph()
        p_st.text = step_title
        p_st.font.name = FONT_SANS
        p_st.font.size = Pt(10.5)
        p_st.font.bold = True
        p_st.font.color.rgb = INK_ONYX

        p_sd = tf_5l.add_paragraph()
        p_sd.text = step_desc
        p_sd.font.name = FONT_SANS
        p_sd.font.size = Pt(9.5)
        p_sd.font.color.rgb = INK_BODY
        p_sd.space_after = Pt(8)

    # Technical Metric Badge on bottom of left card
    b5_l = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.05), Inches(6.52), Inches(5.2), Inches(0.42))
    b5_l.fill.solid()
    b5_l.fill.fore_color.rgb = CARD_SAGE
    b5_l.line.color.rgb = BORDER_SAGE
    b5_l.line.width = Pt(0.8)
    tf_b5l = b5_l.text_frame
    p_b5l = tf_b5l.paragraphs[0]
    p_b5l.alignment = PP_ALIGN.CENTER
    p_b5l.text = "FIELD BENCHMARK: 0ms Local Commit  |  120 Mutations/Min on 2G GPRS"
    p_b5l.font.name = FONT_SANS
    p_b5l.font.size = Pt(8.8)
    p_b5l.font.bold = True
    p_b5l.font.color.rgb = FOREST_DEEP

    c5_r = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.833), Inches(1.92), Inches(5.7), Inches(5.20))
    c5_r.fill.solid()
    c5_r.fill.fore_color.rgb = CARD_WHITE
    c5_r.line.color.rgb = BORDER_SUBTLE
    c5_r.line.width = Pt(1.0)

    strip_5r = s5.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(6.833), Inches(1.92), Inches(5.7), Inches(0.06))
    strip_5r.fill.solid()
    strip_5r.fill.fore_color.rgb = WARM_OCHRE
    strip_5r.line.fill.background()

    tb_5r = s5.shapes.add_textbox(Inches(7.083), Inches(2.10), Inches(5.2), Inches(4.35))
    tf_5r = tb_5r.text_frame
    tf_5r.word_wrap = True
    tf_5r.margin_left = tf_5r.margin_right = tf_5r.margin_top = tf_5r.margin_bottom = 0

    p_5rt = tf_5r.paragraphs[0]
    p_5rt.text = "Deterministic Conflict Resolution Rules"
    p_5rt.font.name = FONT_EDITORIAL
    p_5rt.font.size = Pt(16)
    p_5rt.font.bold = True
    p_5rt.font.color.rgb = WARM_OCHRE
    p_5rt.space_after = Pt(12)

    r_rules = [
        ("Rule 1: Clinician Precedence Overrides ASHA Entry", "When an offline observation logged by an ASHA community worker conflicts with an observation from a Primary Health Center Medical Officer for the same encounter, the Clinician record strictly prevails."),
        ("Rule 2: Timestamp Slot Collision Arbitration", "When two health workers offline-book the exact same appointment slot, the earlier server-verified timestamp secures the booking; the contested second booking routes directly to a priority review queue."),
        ("Rule 3: Immutable Audit Reconciliation Log", "No clinical record is ever dropped silently. Every conflict arbitration automatically creates an immutable audit reconciliation entry detailing both payloads, rule applied, and resulting state."),
        ("Rule 4: Field Worker Sync Heartbeat Confirmation", "Following reconciliation, the field worker's local database receives the reconciled FHIR resource ID during the next heartbeat without disrupting active field consultations.")
    ]
    for r_title, r_desc in r_rules:
        p_rt = tf_5r.add_paragraph()
        p_rt.text = r_title
        p_rt.font.name = FONT_SANS
        p_rt.font.size = Pt(10.5)
        p_rt.font.bold = True
        p_rt.font.color.rgb = INK_ONYX

        p_rd = tf_5r.add_paragraph()
        p_rd.text = r_desc
        p_rd.font.name = FONT_SANS
        p_rd.font.size = Pt(9.5)
        p_rd.font.color.rgb = INK_BODY
        p_rd.space_after = Pt(8)

    # Technical Metric Badge on bottom of right card
    b5_r = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(7.083), Inches(6.52), Inches(5.2), Inches(0.42))
    b5_r.fill.solid()
    b5_r.fill.fore_color.rgb = CARD_OCHRE
    b5_r.line.color.rgb = BORDER_OCHRE
    b5_r.line.width = Pt(0.8)
    tf_b5r = b5_r.text_frame
    p_b5r = tf_b5r.paragraphs[0]
    p_b5r.alignment = PP_ALIGN.CENTER
    p_b5r.text = "AUDIT GUARANTEE: DPDP Act S.8 Compliant  |  Zero Silent Dropped Mutations"
    p_b5r.font.name = FONT_SANS
    p_b5r.font.size = Pt(8.8)
    p_b5r.font.bold = True
    p_b5r.font.color.rgb = WARM_OCHRE

    s5.notes_slide.notes_text_frame.text = (
        "Slide 5 Speaking Notes:\n"
        "Emphasize the conflict resolution rules: In rural healthcare, two health workers might update the same patient while disconnected.\n"
        "We avoid data loss through explicit Clinician Precedence and timestamped review queue fallback - nothing is dropped silently!"
    )

    # =========================================================================
    # SLIDE 6: REST v1 & HL7 FHIR R4 STANDARDS ARCHITECTURE
    # =========================================================================
    s6 = prs.slides.add_slide(blank_layout)
    set_slide_background(s6, BG_CANVAS)
    add_top_navigation(s6, "Interoperability & Data Standards", "REST v1 & HL7 FHIR R4 API Architecture", "National interoperability standards with low-bandwidth payload optimization for rural telecom.", 6)

    c6_l = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.92), Inches(5.7), Inches(5.20))
    c6_l.fill.solid()
    c6_l.fill.fore_color.rgb = CARD_WHITE
    c6_l.line.color.rgb = BORDER_SUBTLE
    c6_l.line.width = Pt(1.0)

    strip_6l = s6.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.92), Inches(5.7), Inches(0.06))
    strip_6l.fill.solid()
    strip_6l.fill.fore_color.rgb = WARM_OCHRE
    strip_6l.line.fill.background()

    tb_6l = s6.shapes.add_textbox(Inches(1.05), Inches(2.10), Inches(5.2), Inches(4.85))
    tf_6l = tb_6l.text_frame
    tf_6l.word_wrap = True
    tf_6l.margin_left = tf_6l.margin_right = tf_6l.margin_top = tf_6l.margin_bottom = 0

    p_6lt = tf_6l.paragraphs[0]
    p_6lt.text = "2G Bandwidth Optimization & Contract"
    p_6lt.font.name = FONT_EDITORIAL
    p_6lt.font.size = Pt(16)
    p_6lt.font.bold = True
    p_6lt.font.color.rgb = WARM_OCHRE
    p_6lt.space_after = Pt(12)

    api_points = [
        ("Strict JSON Envelope Specification", "Every endpoint adheres to a strict contract: { data, meta, errors }. Meta includes DPDP compliance version, server timestamp, and pagination tokens."),
        ("Projection Filtering (?compact=true)", "Mobile clients append ?compact=true or ?fields=id,name,triage_level to omit verbose UI strings, stripping payload size by up to 75% on 2G connections."),
        ("HTTP 304 Not Modified Caching", "ETags and conditional If-None-Match headers are enforced across facility directories and drug formularies to avoid wasteful duplicate downloads."),
        ("Stateless JWT Token Authentication", "Short-lived tokens with cryptographic signature enable lightweight API gateway verification without redundant database lookups.")
    ]
    for apt, apd in api_points:
        p_at = tf_6l.add_paragraph()
        p_at.text = apt
        p_at.font.name = FONT_SANS
        p_at.font.size = Pt(10.5)
        p_at.font.bold = True
        p_at.font.color.rgb = INK_ONYX

        p_ad = tf_6l.add_paragraph()
        p_ad.text = apd
        p_ad.font.name = FONT_SANS
        p_ad.font.size = Pt(9.5)
        p_ad.font.color.rgb = INK_BODY
        p_ad.space_after = Pt(8)

    # API Payload Specimen Box on bottom of left card
    b6_l = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.05), Inches(6.46), Inches(5.2), Inches(0.52))
    b6_l.fill.solid()
    b6_l.fill.fore_color.rgb = CARD_SAND
    b6_l.line.color.rgb = BORDER_OCHRE
    b6_l.line.width = Pt(0.8)
    tf_b6l = b6_l.text_frame
    p_b6l = tf_b6l.paragraphs[0]
    p_b6l.alignment = PP_ALIGN.CENTER
    p_b6l.text = "API SPECIMEN: GET /api/v1/patients/P402?compact=true -> gzip 2.4 KB (-75% vs XML)"
    p_b6l.font.name = FONT_SANS
    p_b6l.font.size = Pt(8.6)
    p_b6l.font.bold = True
    p_b6l.font.color.rgb = WARM_OCHRE

    c6_r = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.833), Inches(1.92), Inches(5.7), Inches(5.20))
    c6_r.fill.solid()
    c6_r.fill.fore_color.rgb = CARD_WHITE
    c6_r.line.color.rgb = BORDER_SUBTLE
    c6_r.line.width = Pt(1.0)

    strip_6r = s6.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(6.833), Inches(1.92), Inches(5.7), Inches(0.06))
    strip_6r.fill.solid()
    strip_6r.fill.fore_color.rgb = FOREST_DEEP
    strip_6r.line.fill.background()

    tb_6r = s6.shapes.add_textbox(Inches(7.083), Inches(2.10), Inches(5.2), Inches(4.30))
    tf_6r = tb_6r.text_frame
    tf_6r.word_wrap = True
    tf_6r.margin_left = tf_6r.margin_right = tf_6r.margin_top = tf_6r.margin_bottom = 0

    p_6rt = tf_6r.paragraphs[0]
    p_6rt.text = "HL7 FHIR R4 Domain Resource Model"
    p_6rt.font.name = FONT_EDITORIAL
    p_6rt.font.size = Pt(16)
    p_6rt.font.bold = True
    p_6rt.font.color.rgb = FOREST_DEEP
    p_6rt.space_after = Pt(12)

    fhir_models = [
        ("Patient & Observation (/api/v1/patients)", "Demographics, ABHA identifiers, blood pressure, blood glucose, hemoglobin, and maternal antenatal logs mapped to standard LOINC codes."),
        ("Appointment (/api/v1/appointments)", "Clinic scheduling, token sequences, and specialist referral tickets structured under standard FHIR Appointment lifecycle states."),
        ("ServiceRequest (/api/v1/escalations)", "Clinical escalation tickets, emergency dispatch requests, and diagnostic lab test orders routed to PHC Medical Officers."),
        ("Location & Organization (/api/v1/facilities)", "Ayushman Arogya Mandirs, Sub-Centers, and Jan Aushadhi generic pharmacy registry with GPS bounding boxes.")
    ]
    for fmt, fmd in fhir_models:
        p_ft = tf_6r.add_paragraph()
        p_ft.text = fmt
        p_ft.font.name = FONT_SANS
        p_ft.font.size = Pt(10.5)
        p_ft.font.bold = True
        p_ft.font.color.rgb = INK_ONYX

        p_fd = tf_6r.add_paragraph()
        p_fd.text = fmd
        p_fd.font.name = FONT_SANS
        p_fd.font.size = Pt(9.5)
        p_fd.font.color.rgb = INK_BODY
        p_fd.space_after = Pt(8)

    # LOINC Codes Badge Row on bottom of right card
    b6_r = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(7.083), Inches(6.46), Inches(5.2), Inches(0.52))
    b6_r.fill.solid()
    b6_r.fill.fore_color.rgb = CARD_SAGE
    b6_r.line.color.rgb = BORDER_SAGE
    b6_r.line.width = Pt(0.8)
    tf_b6r = b6_r.text_frame
    p_b6r = tf_b6r.paragraphs[0]
    p_b6r.alignment = PP_ALIGN.CENTER
    p_b6r.text = "LOINC ENCODINGS: BP 85354-9  |  Glucose 2339-0  |  Hb 718-7  |  ANC 11996-6"
    p_b6r.font.name = FONT_SANS
    p_b6r.font.size = Pt(8.6)
    p_b6r.font.bold = True
    p_b6r.font.color.rgb = FOREST_DEEP

    s6.notes_slide.notes_text_frame.text = (
        "Slide 6 Speaking Notes:\n"
        "By aligning with HL7 FHIR R4, Setu Health is naturally interoperable with ABDM (Ayushman Bharat Digital Mission).\n"
        "Our 2G payload shaping guarantees responsive load times even under 30-50 kbps network constraints."
    )

    # =========================================================================
    # SLIDE 7: DPDP ACT 2023 REGULATORY COMPLIANCE
    # =========================================================================
    s7 = prs.slides.add_slide(blank_layout)
    set_slide_background(s7, BG_CANVAS)
    add_top_navigation(s7, "Governance & Legal Compliance", "DPDP Act 2023 Regulatory Compliance Architecture", "Privacy-by-design framework aligned with the Digital Personal Data Protection Act, 2023.", 7)

    dpdp_cards = [
        {
            "num": "SECTION 7 | LEGITIMATE PURPOSE",
            "title": "Mandatory Purpose-of-Use Header",
            "body": "Enforced at the reverse proxy boundary. Every incoming request must provide a valid 'X-Purpose-Of-Use' header; absent or unrecognized headers trigger instant HTTP 403 (SECURITY_CONSENT_VIOLATION).",
            "accent": FOREST_DEEP,
            "x": Inches(0.8), "y": Inches(1.92), "w": Inches(5.7), "h": Inches(2.20)
        },
        {
            "num": "SECTION 6(1) | SCOPE SPECIFICITY",
            "title": "Whitelisted Clinical Scopes",
            "body": "Access is strictly partitioned into whitelisted scopes: 'care-coordination', 'triage', 'emergency-dispatch', 'offline-sync', and 'audit-review'. Unrelated clinical data queries are blocked at schema level.",
            "accent": WARM_OCHRE,
            "x": Inches(6.833), "y": Inches(1.92), "w": Inches(5.7), "h": Inches(2.20)
        },
        {
            "num": "SECTION 6(2) | VERNACULAR CONSENT",
            "title": "Vernacular & Spoken Audio Consent",
            "body": "Consent artifacts ('v1.2-DPDP-2023') are captured in regional languages (Marathi/Hindi) via audio playback confirmation or biometric/icon-PIN signature, ensuring informed consent for non-literate citizens.",
            "accent": FOREST_VIBRANT,
            "x": Inches(0.8), "y": Inches(4.30), "w": Inches(5.7), "h": Inches(2.20)
        },
        {
            "num": "SECTION 12 | RIGHT TO WITHDRAW",
            "title": "Granular Revocation & Audit Ledger",
            "body": "Patients retain statutory rights to revoke data sharing without disrupting primary care delivery. All data disclosures generate immutable timestamped records in an audit ledger.",
            "accent": DEEP_WINE,
            "x": Inches(6.833), "y": Inches(4.30), "w": Inches(5.7), "h": Inches(2.20)
        }
    ]

    for dp in dpdp_cards:
        dpc = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, dp["x"], dp["y"], dp["w"], dp["h"])
        dpc.fill.solid()
        dpc.fill.fore_color.rgb = CARD_WHITE
        dpc.line.color.rgb = BORDER_SUBTLE
        dpc.line.width = Pt(1.0)

        dstrip = s7.shapes.add_shape(MSO_SHAPE.RECTANGLE, dp["x"], dp["y"], Inches(0.08), dp["h"])
        dstrip.fill.solid()
        dstrip.fill.fore_color.rgb = dp["accent"]
        dstrip.line.fill.background()

        tb_dp = s7.shapes.add_textbox(dp["x"] + Inches(0.28), dp["y"] + Inches(0.18), dp["w"] - Inches(0.45), dp["h"] - Inches(0.32))
        tf_dp = tb_dp.text_frame
        tf_dp.word_wrap = True
        tf_dp.margin_left = tf_dp.margin_right = tf_dp.margin_top = tf_dp.margin_bottom = 0

        p_dp_num = tf_dp.paragraphs[0]
        p_dp_num.text = dp["num"]
        p_dp_num.font.name = FONT_SANS
        p_dp_num.font.size = Pt(9.5)
        p_dp_num.font.bold = True
        p_dp_num.font.color.rgb = dp["accent"]
        p_dp_num.space_after = Pt(2)

        p_dp_tit = tf_dp.add_paragraph()
        p_dp_tit.text = dp["title"]
        p_dp_tit.font.name = FONT_EDITORIAL
        p_dp_tit.font.size = Pt(14)
        p_dp_tit.font.bold = True
        p_dp_tit.font.color.rgb = INK_ONYX
        p_dp_tit.space_after = Pt(8)

        p_dp_b = tf_dp.add_paragraph()
        p_dp_b.text = dp["body"]
        p_dp_b.font.name = FONT_SANS
        p_dp_b.font.size = Pt(10.2)
        p_dp_b.font.color.rgb = INK_BODY

    # Full-width Statutory Assurance Banner at bottom of Slide 7
    sb_7 = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(6.62), Inches(11.733), Inches(0.48))
    sb_7.fill.solid()
    sb_7.fill.fore_color.rgb = CARD_SAGE
    sb_7.line.color.rgb = BORDER_SAGE
    sb_7.line.width = Pt(0.8)
    tf_sb7 = sb_7.text_frame
    p_sb7 = tf_sb7.paragraphs[0]
    p_sb7.alignment = PP_ALIGN.CENTER
    p_sb7.text = "STATUTORY ASSURANCE: Full compliance with Sections 6, 7 & 8 of DPDP Act 2023  |  Zero Commercial Data Exploitation  |  Encrypted Audit Retention"
    p_sb7.font.name = FONT_SANS
    p_sb7.font.size = Pt(8.8)
    p_sb7.font.bold = True
    p_sb7.font.color.rgb = FOREST_DEEP

    s7.notes_slide.notes_text_frame.text = (
        "Slide 7 Speaking Notes:\n"
        "Under the DPDP Act 2023, data fiduciaries must justify why data is accessed.\n"
        "Setu Health implements purpose-of-use gatekeeping: every API request must present X-Purpose-Of-Use, "
        "and consent can be captured in audio for low-literacy rural citizens."
    )

    # =========================================================================
    # SLIDE 8: CLINICAL SAFETY PHILOSOPHY & MEDICAL RAG TRIAGE
    # =========================================================================
    s8 = prs.slides.add_slide(blank_layout)
    set_slide_background(s8, BG_CANVAS)
    add_top_navigation(s8, "Clinical Governance & AI Ethics", "Clinical Safety Philosophy & Medical RAG Triage", "Advisory decision support, deterministic emergency gatekeeping, and grounded retrieval.", 8)

    ab = s8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.92), Inches(11.733), Inches(1.05))
    ab.fill.solid()
    ab.fill.fore_color.rgb = CARD_WINE
    ab.line.color.rgb = BORDER_WINE
    ab.line.width = Pt(1.0)

    astrip = s8.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.92), Inches(0.10), Inches(1.05))
    astrip.fill.solid()
    astrip.fill.fore_color.rgb = DEEP_WINE
    astrip.line.fill.background()

    tb_ab = s8.shapes.add_textbox(Inches(1.05), Inches(2.02), Inches(11.3), Inches(0.85))
    tf_ab = tb_ab.text_frame
    tf_ab.word_wrap = True
    tf_ab.margin_left = tf_ab.margin_right = tf_ab.margin_top = tf_ab.margin_bottom = 0

    p_ab1 = tf_ab.paragraphs[0]
    p_ab1.text = "CRITICAL SAFETY DIRECTIVE: DETERMINISTIC EMERGENCY BYPASS"
    p_ab1.font.name = FONT_SANS
    p_ab1.font.size = Pt(10.5)
    p_ab1.font.bold = True
    p_ab1.font.color.rgb = DEEP_WINE

    p_ab2 = tf_ab.add_paragraph()
    p_ab2.text = "Life-threatening symptoms (postpartum hemorrhage, infant lethargy, acute dyspnea) immediately bypass AI evaluation, routing instantly to 102/112 ambulance dispatch and PHC Medical Officer alerts."
    p_ab2.font.name = FONT_SANS
    p_ab2.font.size = Pt(10)
    p_ab2.font.color.rgb = INK_ONYX

    c8_l = s8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(3.18), Inches(5.7), Inches(3.95))
    c8_l.fill.solid()
    c8_l.fill.fore_color.rgb = CARD_WHITE
    c8_l.line.color.rgb = BORDER_SUBTLE
    c8_l.line.width = Pt(1.0)

    strip_8l = s8.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(3.18), Inches(5.7), Inches(0.06))
    strip_8l.fill.solid()
    strip_8l.fill.fore_color.rgb = DEEP_WINE
    strip_8l.line.fill.background()

    tb_8l = s8.shapes.add_textbox(Inches(1.05), Inches(3.34), Inches(5.2), Inches(3.65))
    tf_8l = tb_8l.text_frame
    tf_8l.word_wrap = True
    tf_8l.margin_left = tf_8l.margin_right = tf_8l.margin_top = tf_8l.margin_bottom = 0

    p_8lt = tf_8l.paragraphs[0]
    p_8lt.text = "SaMD Boundaries & Guardrails"
    p_8lt.font.name = FONT_EDITORIAL
    p_8lt.font.size = Pt(15)
    p_8lt.font.bold = True
    p_8lt.font.color.rgb = DEEP_WINE
    p_8lt.space_after = Pt(10)

    samd_points = [
        ("Non-Diagnostic Decision Support", "The engine operates strictly as an advisory clinical decision support system, explicitly restricted from issuing autonomous medical diagnoses."),
        ("Clinician-in-the-Loop Urgency", "Triage outputs assist the community health worker in determining referral urgency: Emergency (Red), Semi-Urgent (Yellow), or Routine (Green)."),
        ("Controlled Phrasing Framing", "Language strictly uses phrases such as 'Symptom profile is consistent with...' and never definitive diagnostic assertions like 'Patient has disease X'."),
        ("Zero Hallucination Tolerance", "LLM reasoning is prevented from generating ad-hoc prescription dosages or ungrounded pharmacological treatments.")
    ]
    for st, sd in samd_points:
        p_st = tf_8l.add_paragraph()
        p_st.text = st
        p_st.font.name = FONT_SANS
        p_st.font.size = Pt(10)
        p_st.font.bold = True
        p_st.font.color.rgb = INK_ONYX

        p_sd = tf_8l.add_paragraph()
        p_sd.text = sd
        p_sd.font.name = FONT_SANS
        p_sd.font.size = Pt(9.2)
        p_sd.font.color.rgb = INK_BODY
        p_sd.space_after = Pt(6)

    c8_r = s8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.833), Inches(3.18), Inches(5.7), Inches(3.95))
    c8_r.fill.solid()
    c8_r.fill.fore_color.rgb = CARD_WHITE
    c8_r.line.color.rgb = BORDER_SUBTLE
    c8_r.line.width = Pt(1.0)

    strip_8r = s8.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(6.833), Inches(3.18), Inches(5.7), Inches(0.06))
    strip_8r.fill.solid()
    strip_8r.fill.fore_color.rgb = FOREST_DEEP
    strip_8r.line.fill.background()

    tb_8r = s8.shapes.add_textbox(Inches(7.083), Inches(3.34), Inches(5.2), Inches(3.65))
    tf_8r = tb_8r.text_frame
    tf_8r.word_wrap = True
    tf_8r.margin_left = tf_8r.margin_right = tf_8r.margin_top = tf_8r.margin_bottom = 0

    p_8rt = tf_8r.paragraphs[0]
    p_8rt.text = "Grounded Medical RAG & Offline Trees"
    p_8rt.font.name = FONT_EDITORIAL
    p_8rt.font.size = Pt(15)
    p_8rt.font.bold = True
    p_8rt.font.color.rgb = FOREST_DEEP
    p_8rt.space_after = Pt(10)

    rag_points = [
        ("Multi-Dimensional Assessment", "Evaluates palpable complaints (e.g. soft tissue lumps) based on anatomic location, tissue depth, tenderness (0-10), and growth velocity."),
        ("Differential Guidance", "Distinguishes benign subcutaneous lipomas and epidermal cysts from tender angiolipomas or suspected malignant lesions requiring immediate ultrasound."),
        ("Peer-Reviewed Grounding Base", "Retrieval augmented generation vectors are strictly indexed against verified clinical guidelines (Mayo Clinic, NIH StatPearls, and NCCN oncological protocols)."),
        ("Offline Fallback Decision Trees", "When disconnected, RAG degrades gracefully to deterministic hard-coded clinical decision trees cached locally on device.")
    ]
    for rt, rd in rag_points:
        p_rt = tf_8r.add_paragraph()
        p_rt.text = rt
        p_rt.font.name = FONT_SANS
        p_rt.font.size = Pt(10)
        p_rt.font.bold = True
        p_rt.font.color.rgb = INK_ONYX

        p_rd = tf_8r.add_paragraph()
        p_rd.text = rd
        p_rd.font.name = FONT_SANS
        p_rd.font.size = Pt(9.2)
        p_rd.font.color.rgb = INK_BODY
        p_rd.space_after = Pt(6)

    s8.notes_slide.notes_text_frame.text = (
        "Slide 8 Speaking Notes:\n"
        "We treat clinical safety with zero tolerance for hallucinations. Life-threatening red flags are hard-coded to trigger emergency services without waiting for LLM responses.\n"
        "Non-acute cases use grounded RAG with peer-reviewed literature."
    )

    # =========================================================================
    # SLIDE 9: COMMUNITY PLATFORM, MARKETPLACE & KPIS
    # =========================================================================
    s9 = prs.slides.add_slide(blank_layout)
    set_slide_background(s9, BG_CANVAS)
    add_top_navigation(s9, "Ecosystem Integration & Impact", "Community Platform, Marketplace & Impact KPIs", "Holistic healthcare ecosystem integrating generic pharmacies, voice bots, and field KPIs.", 9)

    w_kpi = Inches(2.72)
    gap_kpi = Inches(0.28)
    l_kpi = Inches(0.8)

    kpi_items = [
        (">= 40%", "Target Population", "Coverage of eligible demographic across pilot rural talukas.", FOREST_DEEP),
        (">= 99.9%", "Sync Success Rate", "Deterministic reconciliation with zero clinical record loss.", WARM_OCHRE),
        (">= 60%", "Video Completion", "Retention on maternal & neonatal hygiene video modules.", GOLD_OCHRE),
        ("0.0%", "Red-Flag Misses", "Absolute zero false-negative target on acute emergencies.", DEEP_WINE)
    ]

    for idx, (k_num, k_lbl, k_sub, k_col) in enumerate(kpi_items):
        kx = l_kpi + (w_kpi + gap_kpi) * idx
        kbox = s9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, kx, Inches(1.92), w_kpi, Inches(1.42))
        kbox.fill.solid()
        kbox.fill.fore_color.rgb = CARD_WHITE
        kbox.line.color.rgb = BORDER_SUBTLE
        kbox.line.width = Pt(1.0)

        kstrip = s9.shapes.add_shape(MSO_SHAPE.RECTANGLE, kx, Inches(1.92), Inches(0.06), Inches(1.42))
        kstrip.fill.solid()
        kstrip.fill.fore_color.rgb = k_col
        kstrip.line.fill.background()

        tb_kb = s9.shapes.add_textbox(kx + Inches(0.18), Inches(2.02), w_kpi - Inches(0.26), Inches(1.22))
        tf_kb = tb_kb.text_frame
        tf_kb.word_wrap = True
        tf_kb.margin_left = tf_kb.margin_right = tf_kb.margin_top = tf_kb.margin_bottom = 0

        p1 = tf_kb.paragraphs[0]
        p1.text = k_num
        p1.font.name = FONT_EDITORIAL
        p1.font.size = Pt(22)
        p1.font.bold = True
        p1.font.color.rgb = k_col

        p2 = tf_kb.add_paragraph()
        p2.text = k_lbl
        p2.font.name = FONT_SANS
        p2.font.size = Pt(10.5)
        p2.font.bold = True
        p2.font.color.rgb = INK_ONYX

        p3 = tf_kb.add_paragraph()
        p3.text = k_sub
        p3.font.name = FONT_SANS
        p3.font.size = Pt(9.0)
        p3.font.color.rgb = INK_MUTED

    c9_l = s9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(3.60), Inches(5.7), Inches(3.52))
    c9_l.fill.solid()
    c9_l.fill.fore_color.rgb = CARD_WHITE
    c9_l.line.color.rgb = BORDER_SUBTLE
    c9_l.line.width = Pt(1.0)

    strip_9l = s9.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(3.60), Inches(5.7), Inches(0.06))
    strip_9l.fill.solid()
    strip_9l.fill.fore_color.rgb = FOREST_DEEP
    strip_9l.line.fill.background()

    tb_9l = s9.shapes.add_textbox(Inches(1.05), Inches(3.80), Inches(5.2), Inches(3.15))
    tf_9l = tb_9l.text_frame
    tf_9l.word_wrap = True
    tf_9l.margin_left = tf_9l.margin_right = tf_9l.margin_top = tf_9l.margin_bottom = 0

    p_9lt = tf_9l.paragraphs[0]
    p_9lt.text = "Affordable Generic Medicine Marketplace"
    p_9lt.font.name = FONT_EDITORIAL
    p_9lt.font.size = Pt(15)
    p_9lt.font.bold = True
    p_9lt.font.color.rgb = FOREST_DEEP
    p_9lt.space_after = Pt(10)

    mkt_points = [
        ("Jan Aushadhi Kendra Integration", "Direct digital catalog of quality generic pharmaceuticals offering up to 90% savings compared to branded alternatives."),
        ("Clean Delivery & Hygiene Kits", "Pre-packaged maternal delivery kits, iron supplements, and sanitary pads orderable through village ASHA workers."),
        ("Transparent Village Pricing", "Standardized government pricing displayed in local Marathi numerals, eliminating rural pharmacy price gouging.")
    ]
    for mt, md in mkt_points:
        p_mt = tf_9l.add_paragraph()
        p_mt.text = "*  " + mt
        p_mt.font.name = FONT_SANS
        p_mt.font.size = Pt(10.5)
        p_mt.font.bold = True
        p_mt.font.color.rgb = INK_ONYX

        p_md = tf_9l.add_paragraph()
        p_md.text = md
        p_md.font.name = FONT_SANS
        p_md.font.size = Pt(9.5)
        p_md.font.color.rgb = INK_BODY
        p_md.space_after = Pt(6)

    c9_r = s9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.833), Inches(3.60), Inches(5.7), Inches(3.52))
    c9_r.fill.solid()
    c9_r.fill.fore_color.rgb = CARD_WHITE
    c9_r.line.color.rgb = BORDER_SUBTLE
    c9_r.line.width = Pt(1.0)

    strip_9r = s9.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(6.833), Inches(3.60), Inches(5.7), Inches(0.06))
    strip_9r.fill.solid()
    strip_9r.fill.fore_color.rgb = WARM_OCHRE
    strip_9r.line.fill.background()

    tb_9r = s9.shapes.add_textbox(Inches(7.083), Inches(3.80), Inches(5.2), Inches(3.15))
    tf_9r = tb_9r.text_frame
    tf_9r.word_wrap = True
    tf_9r.margin_left = tf_9r.margin_right = tf_9r.margin_top = tf_9r.margin_bottom = 0

    p_9rt = tf_9r.paragraphs[0]
    p_9rt.text = "Vernacular Voice Bot & Community Circles"
    p_9rt.font.name = FONT_EDITORIAL
    p_9rt.font.size = Pt(15)
    p_9rt.font.bold = True
    p_9rt.font.color.rgb = WARM_OCHRE
    p_9rt.space_after = Pt(10)

    comm_points = [
        ("Sakhi Multilingual Voice Bot", "Conversational audio assistant supporting Marathi, Hindi, and local tribal dialects, enabling completely voice-driven triage."),
        ("Pre-Moderated Peer Support Circles", "Maternal support circles with real-time keyword filtering to stop medical misinformation before public posting."),
        ("Preventive Health Education Caching", "Short vernacular instructional animations cached offline on village tablets for group viewing during village health days.")
    ]
    for ct, cd in comm_points:
        p_ct = tf_9r.add_paragraph()
        p_ct.text = "*  " + ct
        p_ct.font.name = FONT_SANS
        p_ct.font.size = Pt(10.5)
        p_ct.font.bold = True
        p_ct.font.color.rgb = INK_ONYX

        p_cd = tf_9r.add_paragraph()
        p_cd.text = cd
        p_cd.font.name = FONT_SANS
        p_cd.font.size = Pt(9.5)
        p_cd.font.color.rgb = INK_BODY
        p_cd.space_after = Pt(6)

    s9.notes_slide.notes_text_frame.text = (
        "Slide 9 Speaking Notes:\n"
        "Beyond technology, impact is measured by community adoption and affordability. Jan Aushadhi integration slashes medicine costs by up to 90%, "
        "and our pilot metrics hold the system to a 99.9% sync reliability and 0.0% emergency miss rate."
    )

    # =========================================================================
    # SLIDE 10: CONCLUSION & PHASED ENGINEERING ROADMAP
    # =========================================================================
    s10 = prs.slides.add_slide(blank_layout)
    set_slide_background(s10, BG_CANVAS)
    add_top_navigation(s10, "Summary & Phased Roadmap", "Conclusion & Engineering Roadmap", "Synthesizing completed technical deliverables and outlining phased field pilot milestones.", 10)

    c10_l = s10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.92), Inches(5.7), Inches(5.20))
    c10_l.fill.solid()
    c10_l.fill.fore_color.rgb = CARD_WHITE
    c10_l.line.color.rgb = BORDER_SUBTLE
    c10_l.line.width = Pt(1.0)

    strip_10l = s10.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.92), Inches(5.7), Inches(0.06))
    strip_10l.fill.solid()
    strip_10l.fill.fore_color.rgb = FOREST_DEEP
    strip_10l.line.fill.background()

    tb_10l = s10.shapes.add_textbox(Inches(1.05), Inches(2.10), Inches(5.2), Inches(4.85))
    tf_10l = tb_10l.text_frame
    tf_10l.word_wrap = True
    tf_10l.margin_left = tf_10l.margin_right = tf_10l.margin_top = tf_10l.margin_bottom = 0

    p_10lt = tf_10l.paragraphs[0]
    p_10lt.text = "Delivered Engineering Milestones (Current)"
    p_10lt.font.name = FONT_EDITORIAL
    p_10lt.font.size = Pt(16)
    p_10lt.font.bold = True
    p_10lt.font.color.rgb = FOREST_DEEP
    p_10lt.space_after = Pt(12)

    delivered = [
        ("VERIFIED: Production-Ready Offline PWA", "Next.js 16 / React 19 application featuring IndexedDB storage and optimistic local mutation queues operating 100% offline."),
        ("VERIFIED: Standards-Compliant Backend", "Interoperable REST v1 and HL7 FHIR R4 microservices with built-in DPDP Act 2023 purpose verification gatekeepers."),
        ("VERIFIED: Grounded Clinical RAG Engine", "Evidence-backed symptom questionnaire pipeline with hard-coded emergency red-flag bypasses to 102/112 ambulance dispatch."),
        ("VERIFIED: Multi-Channel Degradation Tier", "Complete architecture ready for basic 2G feature phone SMS/USSD and automated IVR telephone triage fallback.")
    ]
    for d_tag, d_desc in delivered:
        p_dt = tf_10l.add_paragraph()
        p_dt.text = d_tag
        p_dt.font.name = FONT_SANS
        p_dt.font.size = Pt(10.5)
        p_dt.font.bold = True
        p_dt.font.color.rgb = FOREST_DEEP

        p_dd = tf_10l.add_paragraph()
        p_dd.text = d_desc
        p_dd.font.name = FONT_SANS
        p_dd.font.size = Pt(9.5)
        p_dd.font.color.rgb = INK_BODY
        p_dd.space_after = Pt(8)

    # Core Audit Completion Badge on bottom of left card
    b10_l = s10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.05), Inches(6.52), Inches(5.2), Inches(0.42))
    b10_l.fill.solid()
    b10_l.fill.fore_color.rgb = CARD_SAGE
    b10_l.line.color.rgb = BORDER_SAGE
    b10_l.line.width = Pt(0.8)
    tf_b10l = b10_l.text_frame
    p_b10l = tf_b10l.paragraphs[0]
    p_b10l.alignment = PP_ALIGN.CENTER
    p_b10l.text = "CORE DELIVERABLES: 100% Offline PWA  |  FHIR R4  |  DPDP Reverse Proxy"
    p_b10l.font.name = FONT_SANS
    p_b10l.font.size = Pt(8.6)
    p_b10l.font.bold = True
    p_b10l.font.color.rgb = FOREST_DEEP

    c10_r = s10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.833), Inches(1.92), Inches(5.7), Inches(5.20))
    c10_r.fill.solid()
    c10_r.fill.fore_color.rgb = CARD_WHITE
    c10_r.line.color.rgb = BORDER_SUBTLE
    c10_r.line.width = Pt(1.0)

    strip_10r = s10.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(6.833), Inches(1.92), Inches(5.7), Inches(0.06))
    strip_10r.fill.solid()
    strip_10r.fill.fore_color.rgb = WARM_OCHRE
    strip_10r.line.fill.background()

    tb_10r = s10.shapes.add_textbox(Inches(7.083), Inches(2.10), Inches(5.2), Inches(4.35))
    tf_10r = tb_10r.text_frame
    tf_10r.word_wrap = True
    tf_10r.margin_left = tf_10r.margin_right = tf_10r.margin_top = tf_10r.margin_bottom = 0

    p_10rt = tf_10r.paragraphs[0]
    p_10rt.text = "Phased Deployment Roadmap (Next Steps)"
    p_10rt.font.name = FONT_EDITORIAL
    p_10rt.font.size = Pt(16)
    p_10rt.font.bold = True
    p_10rt.font.color.rgb = WARM_OCHRE
    p_10rt.space_after = Pt(12)

    roadmap = [
        ("Phase 1: [ Q1 2026 ] Palghar PHC Sub-Center Pilot", "Field validation across 12 Primary Health Centers and 40 ASHA workers in Mokhada and Jawhar blocks."),
        ("Phase 2: [ Q2 2026 ] Telecom Carrier Gateway Integration", "Live link with telecom SMS shortcode (56767) and USSD (*999#) gateway providers for feature phone triage."),
        ("Phase 3: [ Q3 2026 ] ABDM Sandbox Milestone Certification", "Formal certification of Milestone 1, 2, and 3 under the Ayushman Bharat Digital Mission sandbox."),
        ("Phase 4: [ Q4 2026 ] Tribal Dialect Acoustic Tuning", "Expanding Sakhi voice bot acoustic speech models for Warli and localized tribal Konkani dialects.")
    ]
    for r_tag, r_desc in roadmap:
        p_rt = tf_10r.add_paragraph()
        p_rt.text = r_tag
        p_rt.font.name = FONT_SANS
        p_rt.font.size = Pt(10.5)
        p_rt.font.bold = True
        p_rt.font.color.rgb = WARM_OCHRE

        p_rd = tf_10r.add_paragraph()
        p_rd.text = r_desc
        p_rd.font.name = FONT_SANS
        p_rd.font.size = Pt(9.5)
        p_rd.font.color.rgb = INK_BODY
        p_rd.space_after = Pt(8)

    # Execution Horizon Badge on bottom of right card
    b10_r = s10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(7.083), Inches(6.52), Inches(5.2), Inches(0.42))
    b10_r.fill.solid()
    b10_r.fill.fore_color.rgb = CARD_OCHRE
    b10_r.line.color.rgb = BORDER_OCHRE
    b10_r.line.width = Pt(0.8)
    tf_b10r = b10_r.text_frame
    p_b10r = tf_b10r.paragraphs[0]
    p_b10r.alignment = PP_ALIGN.CENTER
    p_b10r.text = "EXECUTION HORIZON: Pilot Target of 40 ASHA Workers  |  >40% Tribal Reach"
    p_b10r.font.name = FONT_SANS
    p_b10r.font.size = Pt(8.6)
    p_b10r.font.bold = True
    p_b10r.font.color.rgb = WARM_OCHRE

    s10.notes_slide.notes_text_frame.text = (
        "Slide 10 Speaking Notes:\n"
        "To conclude: Gentelwell / Setu Health is not a theoretical prototype - it is an engineered, standards-compliant platform "
        "built to withstand the harsher realities of rural public health infrastructure in India.\n"
        "We are ready for PHC sub-center field deployment in Palghar and ABDM milestone certification. Thank you!"
    )

    local_path = "presentation.pptx"
    prs.save(local_path)
    print(f"SUCCESS: Saved local presentation to {os.path.abspath(local_path)}")

    cep_c_path = r"C:\cep_c\ppt.pptx"
    try:
        shutil.copyfile(local_path, cep_c_path)
        print(f"SUCCESS: Copied presentation to {cep_c_path}")
    except Exception as e:
        print(f"Notice: Could not copy to C:\\cep_c: {e}")

if __name__ == "__main__":
    create_presentation()
