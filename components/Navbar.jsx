"use client";
import Link from "next/link";
import { useState } from "react";

const links = [["Home", "/"], ["Health Education", "/health-education"], ["Awareness", "/awareness"], ["Nutrition & Diet", "/nutrition"], ["AI Chatbot", "/chatbot"], ["Videos", "/videos"]];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return <header className="site-header"><nav className="container nav"><Link href="/" className="logo" aria-label="SheCare home"><span>✿</span> SheCare</Link><button className="menu-button" onClick={() => setOpen(!open)} aria-label="Toggle navigation" aria-expanded={open}>☰</button><div className={`nav-links ${open ? "show" : ""}`}>{links.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)}>{label}</Link>)}<Link href="/login" className="nav-login" onClick={() => setOpen(false)}>Log in →</Link></div></nav></header>;
}
