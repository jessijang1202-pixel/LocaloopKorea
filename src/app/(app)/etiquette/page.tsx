"use client";

// ORPHAN route — same content now rendered inside /guide (etiquette tab)

import { useState } from "react";
import { useLang } from "@/lib/lang";
import { useTheme } from "@/lib/theme";
import { Section, Card, Callout, RuleItem } from "@/components/guide/primitives";
import { ETIQUETTE_CATEGORIES, KEY_PHRASES, ETIQUETTE_FULL } from "@/content/etiquette";

export default function EtiquettePage() {
  const isKo = useLang();
  const isDark = useTheme() === "dark";
  const [activeTab, setActiveTab] = useState("all");
  const c = ETIQUETTE_FULL;

  function show(cat: string) {
    return activeTab === "all" || activeTab === cat;
  }

  return (
    <div className="ll-fullpage" style={{ display: "flex", flexDirection: "column", background: "var(--content-bg)" }}>
      {/* Hero */}
      <div style={{
        background: isDark
          ? "linear-gradient(160deg, #1E1015 0%, #2A1510 100%)"
          : "linear-gradient(160deg, #FFF5F2 0%, #FFF0EC 100%)",
        paddingTop: 16, paddingBottom: 24, paddingInline: 20, flexShrink: 0,
        borderBottom: "1px solid var(--border)",
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--grade-s)", letterSpacing: "0.08em", marginBottom: 6 }}>
          LOCALOOP KOREA
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: "var(--foreground)", letterSpacing: "-0.03em", lineHeight: 1.2, marginBottom: 8 }}>
          {isKo ? "문화 & 에티켓 가이드" : "Culture & Etiquette Guide"}
        </h1>
        <p style={{ fontSize: 13, color: "var(--foreground-muted)", lineHeight: 1.6 }}>
          {isKo
            ? "한국에서 실수 없이 생활하는 법 — 현지 문화를 이해하면 한국 생활이 훨씬 즐거워집니다"
            : "How to live in Korea without awkward mistakes — understanding local culture makes everything smoother"}
        </p>

        {/* Category chips */}
        <div style={{ display: "flex", gap: 6, marginTop: 16, overflowX: "auto", paddingBottom: 2, scrollbarWidth: "none" }}>
          {ETIQUETTE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              style={{
                padding: "6px 14px", borderRadius: 20, fontSize: 11, fontWeight: 700, flexShrink: 0,
                background: activeTab === cat.id ? "var(--grade-s)" : isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.07)",
                color: activeTab === cat.id ? "#fff" : "var(--foreground-muted)",
                border: "none", cursor: "pointer",
              }}
            >
              {isKo ? cat.ko : cat.en}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", minHeight: 0, padding: "20px 16px 32px" }}>

        {/* GREETINGS */}
        {show("greeting") && (
          <Section variant="etiquette" title={isKo ? c.greeting.title.ko : c.greeting.title.en}>
            <Card variant="etiquette" accent dark={isDark}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "var(--grade-s)", marginBottom: 6 }}>
                {isKo ? c.greeting.cardHeading.ko : c.greeting.cardHeading.en}
              </div>
              <p style={{ fontSize: 13, color: "var(--foreground)", lineHeight: 1.65 }}>
                {isKo ? c.greeting.cardBody.ko : c.greeting.cardBody.en}
              </p>
            </Card>

            <Card variant="etiquette">
              {c.greeting.rules.map((r, i) => (
                <RuleItem key={i} ok={r.ok} text={isKo ? r.ko : r.en} />
              ))}
            </Card>

            <Callout color="coral">
              {isKo ? c.greeting.calloutCoral.ko : c.greeting.calloutCoral.en}
            </Callout>
          </Section>
        )}

        {/* DINING */}
        {show("dining") && (
          <Section variant="etiquette" title={isKo ? c.dining.title.ko : c.dining.title.en}>
            <Card variant="etiquette">
              <div style={{ fontSize: 12, fontWeight: 800, color: "var(--foreground)", marginBottom: 10 }}>
                {isKo ? c.dining.cardHeading.ko : c.dining.cardHeading.en}
              </div>
              {c.dining.rules.map((r, i) => (
                <RuleItem key={i} ok={r.ok} text={isKo ? r.ko : r.en} />
              ))}
            </Card>

            <Callout color="yellow">
              {isKo ? c.dining.calloutYellow.ko : c.dining.calloutYellow.en}
            </Callout>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {c.dining.grid?.map((item) => (
                <div key={item.en} style={{ background: "var(--card)", borderRadius: 12, padding: "12px 10px", border: "1px solid var(--border)" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "var(--foreground)", marginBottom: 2 }}>{isKo ? item.ko : item.en}</div>
                  <div style={{ fontSize: 10, color: "var(--foreground-muted)", lineHeight: 1.4 }}>{isKo ? item.desc.ko : item.desc.en}</div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* TRANSPORT */}
        {show("transport") && (
          <Section variant="etiquette" title={isKo ? c.transport.title.ko : c.transport.title.en}>
            <Card variant="etiquette">
              {c.transport.rules.map((r, i) => (
                <RuleItem key={i} ok={r.ok} text={isKo ? r.ko : r.en} />
              ))}
            </Card>

            <Callout color="blue">
              {isKo ? c.transport.calloutBlue.ko : c.transport.calloutBlue.en}
            </Callout>
          </Section>
        )}

        {/* TAXI & TRANSPORT (ADVANCED) */}
        {show("transport") && (
          <Section variant="etiquette" title={isKo ? c.taxi.title.ko : c.taxi.title.en}>
            <Card variant="etiquette">
              {c.taxi.rules.map((r, i) => (
                <RuleItem key={i} ok={r.ok} text={isKo ? r.ko : r.en} />
              ))}
            </Card>

            <Callout color="blue">
              {isKo ? c.taxi.calloutBlue.ko : c.taxi.calloutBlue.en}
            </Callout>
          </Section>
        )}

        {/* SOCIAL */}
        {show("social") && (
          <Section variant="etiquette" title={isKo ? c.social.title.ko : c.social.title.en}>
            <Card variant="etiquette" accent dark={isDark}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "var(--grade-s)", marginBottom: 6 }}>
                {isKo ? c.social.cardHeading.ko : c.social.cardHeading.en}
              </div>
              <p style={{ fontSize: 13, color: "var(--foreground)", lineHeight: 1.65 }}>
                {isKo ? c.social.cardBody.ko : c.social.cardBody.en}
              </p>
            </Card>

            <Card variant="etiquette">
              <div style={{ fontSize: 12, fontWeight: 800, color: "var(--foreground)", marginBottom: 10 }}>
                {isKo ? c.social.qaHeading.ko : c.social.qaHeading.en}
              </div>
              {c.social.qa.map((item, i) => (
                <div key={i} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: i < 2 ? "1px solid var(--border)" : "none" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "var(--grade-s)", marginBottom: 3 }}>Q: {isKo ? item.q.ko : item.q.en}</div>
                  <div style={{ fontSize: 11, color: "var(--foreground-muted)", lineHeight: 1.5 }}>→ {isKo ? item.a.ko : item.a.en}</div>
                </div>
              ))}
            </Card>

            {c.social.calloutCoral && (
              <Callout color="coral">
                {isKo ? c.social.calloutCoral.ko : c.social.calloutCoral.en}
              </Callout>
            )}
          </Section>
        )}

        {/* TABOOS */}
        {show("taboo") && (
          <Section variant="etiquette" title={isKo ? c.taboo.title.ko : c.taboo.title.en}>
            <Callout color="red">
              {isKo ? c.taboo.calloutRed.ko : c.taboo.calloutRed.en}
            </Callout>

            <Card variant="etiquette">
              {c.taboo.rules.map((r, i) => (
                <RuleItem key={i} ok={r.ok} text={isKo ? r.ko : r.en} />
              ))}
            </Card>

            <Callout color="yellow">
              {isKo ? c.taboo.calloutYellow.ko : c.taboo.calloutYellow.en}
            </Callout>
          </Section>
        )}

        {/* JJIMJILBANG & BATHHOUSE */}
        {show("bathhouse") && (
          <Section variant="etiquette" title={isKo ? c.bathhouse.title.ko : c.bathhouse.title.en}>
            <Card variant="etiquette">
              {c.bathhouse.rules.map((r, i) => (
                <RuleItem key={i} ok={r.ok} text={isKo ? r.ko : r.en} />
              ))}
            </Card>

            <Callout color="blue">
              {isKo ? c.bathhouse.calloutBlue.ko : c.bathhouse.calloutBlue.en}
            </Callout>
          </Section>
        )}

        {/* HIKING & OUTDOORS */}
        {show("hiking") && (
          <Section variant="etiquette" title={isKo ? c.hiking.title.ko : c.hiking.title.en}>
            <Card variant="etiquette">
              {c.hiking.rules.map((r, i) => (
                <RuleItem key={i} ok={r.ok} text={isKo ? r.ko : r.en} />
              ))}
            </Card>

            <Callout color="blue">
              {isKo ? c.hiking.calloutBlue.ko : c.hiking.calloutBlue.en}
            </Callout>
          </Section>
        )}

        {/* Quick Reference */}
        <div style={{ background: "var(--card)", borderRadius: 18, padding: "20px 16px", textAlign: "center", marginBottom: 8, border: "1px solid var(--border)" }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: "var(--foreground)", marginBottom: 6 }}>
            {isKo ? "핵심 표현 빠른 참고" : "Key Phrases Quick Reference"}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 14 }}>
            {KEY_PHRASES.map((p) => (
              <div key={p.ko} style={{ background: "var(--content-bg)", borderRadius: 12, padding: "10px 8px", border: "1px solid var(--border)" }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: "var(--foreground)", marginBottom: 2 }}>{p.ko}</div>
                <div style={{ fontSize: 9, color: "var(--grade-s)", fontWeight: 600, marginBottom: 3 }}>{p.rom}</div>
                <div style={{ fontSize: 10, color: "var(--foreground-muted)" }}>{p.en}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
