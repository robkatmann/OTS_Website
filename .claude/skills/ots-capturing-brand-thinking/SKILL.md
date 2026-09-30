---
name: ots-capturing-brand-thinking
description: Use when Karen or Kristin share anything about their taste or thinking for Ode to Shelly, even in passing or mid-request, such as likes, dislikes, reasons, corrections, stories, new ideas, decisions, reactions to a design, or facts about the brand, offer, prices or Shelly.
---

# Capturing the designers' brand thinking

## Overview

The long-term goal is to save how Karen and Kristin think, so new websites, a shop or Instagram posts can later be made in their style. Their thinking often arrives as a side remark inside another request ("oh and btw we don't like..."). Capture it in the same session, without being asked.

## What counts

- A like or dislike, especially with a reason ("too intense", "feels like stealing")
- A decision or reversal ("V1 is the base", "keep the standard cursor")
- A fact about the brand, the offer, prices, the process, customers, materials or Shelly
- A new idea, story or reference they bring
- A correction of something Claude assumed

## Where it goes

The repo files below are the only place both designers (and every future Claude session) will see it. Claude's personal memory is not shared.

1. **Always:** add an entry at the top of `docs/brand/taste-log.md` under today's date: `area · decision · why (if said)`. Use their words where possible.
2. **If it changes the bigger picture** (aesthetic, voice, beliefs, offer, what they reject): update the matching section of `docs/brand/brand-brain.md`. Mark the source: (said), (one-pager) or (observed). Remove or correct anything the new information makes wrong; don't leave contradictions.
3. **If it changes how Claude should work** (a new rule for the site, a new workflow): update `CLAUDE.md` too.
4. **Tell them in one short line** what you saved, so they can correct it. Example: "Noted in the brand brain: pink only inside the lace itself, never as a design colour."
5. **Make it reach the other designer:** at a natural pause, offer a save point and to share it (commit and push, after a yes). Until it is pushed, only this laptop has it.

## Rules

- Record what they said, not your interpretation. If you infer a pattern, label it (observed) and ask them to confirm.
- If new information contradicts an older entry, the newer one wins; note the change in the taste log.
- If something is unclear, ask one question before writing it down.

## Common mistakes

| Mistake | Instead |
|---|---|
| Handling the main request and forgetting the side remark | Capture the remark too, in the same session |
| Writing it only in the conversation | Write it in the files; the conversation is forgotten |
| Saving it only to Claude's personal memory | Personal memory stays on one computer and one person. Karen and Kristin work on different laptops: the repo files are the shared brain. (Personal memory may get a copy, the repo gets the real entry.) |
| Keeping an outdated rule next to the new one | Correct the old text |
