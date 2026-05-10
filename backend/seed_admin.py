"""
Seed script — creates admin user + default About page content blocks.
Run once: python3 seed_admin.py
Safe to re-run — skips existing records.
"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from database import SessionLocal, engine, Base
from models.user import User
from models.content import ContentBlock
from security import hash_password

# Import all models so Base knows about them
import models.content  # noqa
import models.user     # noqa

Base.metadata.create_all(bind=engine)

ADMIN_EMAIL    = "admin@brightcone.ai"
ADMIN_PASSWORD = "BrightAdmin2026!"
ADMIN_NAME     = "Admin"

DEFAULT_CONTENT = [
    # ── Hero ──────────────────────────────────────────────────────────────
    ("about.hero.badge",    "text",  "About Brightcone"),
    ("about.hero.title1",   "text",  "Built for teams who take"),
    ("about.hero.title2",   "text",  "AI seriously."),
    ("about.hero.subtitle", "text",  "Brightcone is an enterprise AI platform that makes it easy to build, deploy, and manage intelligent agent workflows — with a premium interface teams actually want to use."),

    # ── Mission ───────────────────────────────────────────────────────────
    ("about.mission.heading", "text", "Make AI agents a production-grade reality."),
    ("about.mission.p1",      "text", "Most AI tooling is built for demos. Brightcone is built for production — with the auth, history, streaming, and orchestration that real enterprise teams need."),
    ("about.mission.p2",      "text", "We believe the next generation of enterprise software will be powered by coordinated AI agents. Our mission is to make that future accessible, reliable, and beautifully simple to operate."),

    # ── Features ──────────────────────────────────────────────────────────
    ("about.features.heading",             "text", "Everything you need. Nothing you don't."),
    ("about.feature.multi-agent.title",    "text", "Multi-Agent Orchestration"),
    ("about.feature.multi-agent.desc",     "text", "Coordinate specialized agents — frontend, backend, QA — inside one focused workspace. Each agent knows its role and executes with precision."),
    ("about.feature.conversation.title",   "text", "Persistent Conversation History"),
    ("about.feature.conversation.desc",    "text", "Every conversation is stored and searchable. Resume where you left off, review past decisions, and maintain full context across sessions."),
    ("about.feature.secure.title",         "text", "Secure by Default"),
    ("about.feature.secure.desc",          "text", "JWT-based authentication, protected routes, and bcrypt password hashing. Enterprise-grade security built in from day one."),
    ("about.feature.streaming.title",      "text", "Real-Time Streaming"),
    ("about.feature.streaming.desc",       "text", "Responses stream live via Server-Sent Events. No waiting for full responses — watch answers appear token by token, instantly."),
    ("about.feature.ui.title",             "text", "Premium UI"),
    ("about.feature.ui.desc",              "text", "A clean, minimal interface with dark and light mode. Built with React, TypeScript, and Tailwind — fast, accessible, and beautiful."),
    ("about.feature.production.title",     "text", "Production Ready"),
    ("about.feature.production.desc",      "text", "From prototype to deployed product with automated testing, CI-friendly deployment scripts, and a codebase built for real teams."),

    # ── Team ──────────────────────────────────────────────────────────────
    ("about.team.subtitle",       "text", "A small, focused team that moves fast, ships clean code, and cares deeply about the product."),
    ("about.team.sam.name",       "text", "Sam"),
    ("about.team.sam.desc",       "text", "Visionary behind Brightcone. Builds the future, one agent at a time."),
    ("about.team.sam.avatar",     "image", ""),
    ("about.team.alex.name",      "text", "Alex"),
    ("about.team.alex.desc",      "text", "Crafts every pixel. Obsessed with UX, performance, and clean design."),
    ("about.team.alex.avatar",    "image", ""),
    ("about.team.jordan.name",    "text", "Jordan"),
    ("about.team.jordan.desc",    "text", "Keeps the engine running. APIs, databases, and everything beneath the surface."),
    ("about.team.jordan.avatar",  "image", ""),
    ("about.team.riley.name",     "text", "Riley"),
    ("about.team.riley.desc",     "text", "Nothing ships without Riley's sign-off. Quality is the baseline, not the goal."),
    ("about.team.riley.avatar",   "image", ""),

    # ── Timeline ──────────────────────────────────────────────────────────
    ("about.timeline.idea.title",         "text", "The Idea"),
    ("about.timeline.idea.desc",          "text", "Brightcone started as a question: why is enterprise AI tooling so painful to use?"),
    ("about.timeline.first-build.title",  "text", "First Build"),
    ("about.timeline.first-build.desc",   "text", "Core chat, auth, and multi-agent orchestration shipped. First internal users onboarded."),
    ("about.timeline.crm.title",          "text", "CRM & Outreach"),
    ("about.timeline.crm.desc",           "text", "Lead management and email outreach capabilities added. Teams started replacing their CRMs."),
    ("about.timeline.enterprise.title",   "text", "Enterprise Launch"),
    ("about.timeline.enterprise.desc",    "text", "Full enterprise platform launched — SSO, reporting, and custom deployments for large teams."),

    # ── Values ────────────────────────────────────────────────────────────
    ("about.value.clarity.title", "text", "Clarity over complexity"),
    ("about.value.clarity.desc",  "text", "We strip away noise. Every feature must earn its place. Simple interfaces that do powerful things."),
    ("about.value.trust.title",   "text", "Trust through transparency"),
    ("about.value.trust.desc",    "text", "No black boxes. You know what the agents are doing, why they're doing it, and what's next."),
    ("about.value.speed.title",   "text", "Speed without shortcuts"),
    ("about.value.speed.desc",    "text", "Move fast but never at the cost of reliability. Good engineering is how we respect our users' time."),

    # ── CTA ───────────────────────────────────────────────────────────────
    ("about.cta.heading",  "text", "Join teams building the future with Brightcone."),
    ("about.cta.subtitle", "text", "Get access to the full platform — multi-agent orchestration, streaming chat, and enterprise-ready deployment."),

    # ── Hero image (optional) ─────────────────────────────────────────────
    ("about.hero.image", "image", ""),
]


def run():
    db = SessionLocal()
    try:
        # ── Admin user ────────────────────────────────────────────────────
        existing = db.query(User).filter(User.email == ADMIN_EMAIL).first()
        if existing:
            if not existing.is_admin:
                existing.is_admin = True
                db.commit()
                print(f"✅ Promoted existing user {ADMIN_EMAIL} to admin")
            else:
                print(f"⏭️  Admin user {ADMIN_EMAIL} already exists")
        else:
            admin = User(
                name=ADMIN_NAME,
                email=ADMIN_EMAIL,
                password_hash=hash_password(ADMIN_PASSWORD),
                avatar_url="",
                bio="",
                is_admin=True,
            )
            db.add(admin)
            db.commit()
            print(f"✅ Created admin user: {ADMIN_EMAIL}")

        # ── Content blocks ────────────────────────────────────────────────
        created = 0
        skipped = 0
        for key, content_type, value in DEFAULT_CONTENT:
            exists = db.query(ContentBlock).filter(ContentBlock.key == key).first()
            if exists:
                skipped += 1
                continue
            block = ContentBlock(key=key, content_type=content_type, value=value)
            db.add(block)
            created += 1

        db.commit()
        print(f"✅ Content blocks: {created} created, {skipped} skipped")

    finally:
        db.close()


if __name__ == "__main__":
    run()
