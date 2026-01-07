# ADHD Command Centre UI Style Guide

## Phone-first design goals
- Calm, uncluttered command dashboard, no urgency sirens.
- Lots of whitespace, clear hierarchy.
- One primary CTA per screen.
- Large readable text, thumb-friendly controls.

## Component rules
- Use rounded-2xl cards, subtle border/shadow.
- Tap targets >= 48px.
- Use system font stack.
- Minimal colour; rely on spacing and type size/weight.

## Reusable components
### Card
- Props: title?: string, rightAction?: ReactNode, children
- Styles: rounded-2xl, p-4, subtle border, consistent spacing.

### PrimaryButton
- Props: label, sublabel?, onClick, fullWidth (default true), size lg|md
- Design: big, calm, full-width on mobile, min height 52px.

### SecondaryButton
- Props: label, onClick
- Used for snooze/later/options, lower emphasis.

### StatusPill
- Props: label, state: good|neutral|attention, icon optional
- Used for Eat/Water/Move and tags.

### SectionHeader
- Props: title, actionLabel?, onAction?
- Displays title left and small text button right.

### TaskRow
- Props: task, onToggleDone, onSnooze, onEdit, showMeta boolean
- Layout: big checkbox, title, meta row (estimate/energy/mode).

### BottomTabs
- Icon + label, always visible, safe-area inset.
