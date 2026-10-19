# Project preview assembly rework - implementation plan

Updated: 2026-10-19. Status: implemented for the first animation delivery; desktop notes remain deferred. See [implementation evidence](.impeccable/review/assembly/README.md). The selected pacing is four viewport heights total after reviewing the two-height starting point.

## Owner follow-up — concurrent motion (2026-10-19)

The owner found the initial motion insufficiently immersive and asked arrows to start as blocks move into position. This supersedes the initial serial assembly/wire timeline and the decision to wait for all nodes to settle. The delivered refinement uses larger separated offsets, overlapping node arrivals from 4–72%, connections that start with their movement groups and follow both moving ports, and a wider scene framing that pulls into the final composition by 78%. The complete graph and CTA still hold over 80–100% of the same four-height track. Fit checks cover the enlarged opening; 390px phones remain pinned and tighter viewports use the complete static fallback when labels would be too small. See [updated evidence](.impeccable/review/assembly-overlap/README.md). The sections below preserve the initial delivery plan; this follow-up governs the revised choreography.


This plan develops the owner's answers preserved in Appendix A. It covers the homepage selected-work sequence. The visitor should understand how a project fits together by scrolling from separated components to one complete, readable architecture diagram.

## 1. Confirmed decisions and implementation recommendations

### Confirmed by the owner

- Each project's title and description enter through ordinary page scrolling, then remain pinned while its schematic assembles beneath them.
- The section heading, "Selected work", scrolls away normally.
- Components start separated, slide into place, and are then connected by progressively drawn wires.
- Every drawing wire has an arrowhead at its advancing tip, pointing along its direction of travel.
- Schematics need more internal detail than the current drawings. Temporary illustrative content is permitted; the owner will supply actual details later.
- Desktop explanations and notes are on hold. The owner must see the schematic scroll animation before deciding their frequency, placement or treatment. The first animation preview contains no step-note UI.
- Start each project at two viewport heights total, including the visible stage and its pinned scroll travel. If the first animation preview feels too compressed, the owner authorizes doubling the total article height to four viewport heights. Normal scrolling through the sequence is required; no skip-sequence control is requested.
- The end of each project has a CTA linking to its matching catalog entry, for example `/projects#project-01`. Add stable entry anchors; dedicated project pages are outside this plan.
- Phones retain pinned assembly with a smaller composition and no visible explanation notes.
- The final state is a whole, completed, readable diagram, not a perpetually exploded view or an incomplete transition.

### Recommended decisions for unspecified details

- Use the first preview to judge the component assembly, advancing arrowheads, final readability and pacing. Do not build a note rail, note strip, explanatory note transitions or an empty placeholder column while notes are deferred. Keep component labels, the ordinary project description and a concise accessible graph summary.
- "Reveal" for project introductions means entering the viewport through normal scrolling. Keep titles and descriptions visible in server-rendered HTML; no opacity entrance effect.
- On genuinely insufficient viewport space, at enlarged text, with reduced motion, without JavaScript or after initialization failure, use the complete static diagram in normal flow. Pinning must not make content unreachable.

The latest owner direction on 2026-10-19 keeps catalog-entry CTAs, makes two screen heights total the starting point with four total explicitly permitted if needed, and defers desktop notes until the animation has been reviewed. This supersedes both the former fixed two-height requirement and earlier note-layout recommendations. No additional note-design question is needed before the first animation preview.

## 2. Scope and existing constraints

### Included

1. Homepage studies for stable record IDs `01` (Agentic AI Assistant), `02` (Portfolio Website) and `03` (Task Automation Bot), in that order.
2. A reusable sticky project stage, detailed assembly-specific schematics, mobile compositions, final CTA and static fallbacks. Desktop notes are deferred to a later decision after the animation preview.
3. A single owner of the animation state for each diagram.
4. Stable catalog-entry anchors for the confirmed CTA destinations.
5. Relevant browser regressions, visual captures, canonical contract updates and implementation records.

### Preserved

- The Engineering Field Journal identity, existing theme tokens, typography and focus treatment: paper/ink/cobalt in light mode and the existing dark theme/orange accent.
- Hero, shared particles/workbench behavior, About, contact, resume, assistant, chat API, project records and existing dialogs.
- Existing `/projects` gallery/list layouts, filtering, view persistence and its current schematic motion. Assembly-specific drawing details belong to home and must not silently replace the catalog studies.
- Astro, Tailwind and vanilla JavaScript. No animation framework or new dependency is required.
- `#neko-chat`, its critical `flex h-full min-h-0 flex-col overflow-hidden` wrapper, and the inline `nodejs22.x` build patch.
- Original source, earlier mockup, environment files and protected public assets.

Current source has four project records, although older vault specifications refer to twenty. Do not add or remove projects to reconcile that historical discrepancy. Select by stable ID instead of relying on `projects.slice(0, 3)` and positional variant arrays.

The homepage currently initializes `[data-diagram]` motion in both `index.astro` and `ScrollDrafting.astro`, the latter included by `BaseLayout.astro`. The current sine-shaped explode/reassemble curve is not suitable for progressive assembly and must not continue writing to new home studies.

## 3. Visitor journey and layout

1. Visitor scrolls from the hero into Selected work; that heading and introduction continue upward normally.
2. The next project introduction enters in ordinary document flow, with its separated components already contained inside the diagram board.
3. When the article reaches the sticky inset, its stage pins. The stage contains the project's title/description above the diagram and reserved completion/CTA area. Give the diagram the available width; do not reserve note-rail space.
4. Scroll progress moves component groups into their final positions. Their labels and internal details travel with them.
5. Once all components have settled, directed wires draw from their source ports to their destination ports. Arrowheads lead each drawing wire.
6. The completed diagram remains assembled for the final portion of the scroll and the CTA is available. There is no changing explanation note in the first preview.
7. The article boundary releases the complete stage. It scrolls away naturally before the next project stage pins. Do not overlay or stack sticky project headers.
8. The last study releases into the existing archive link, followed by About and contact.

Use a single sticky stage per article. Keep the project heading in that stage rather than independently pinning a heading, diagram and footer with separate offsets. Reserve actual layout space for all parts, including the longest title/description and CTA. Avoid ancestor overflow rules that create an unintended scroll container; clip only within the schematic board where all authored motion fits.

The current site masthead is not fixed. Use a small top inset plus the safe-area allowance, not an assumed permanent navbar height. Keep stage stacking below assistant and modal layers. Preserve background content clearance around figures, descriptions and controls; change the workbench only if a specific clearance regression is demonstrated.

## 4. Scroll geometry and lifecycle

### Duration model

Define `V` as a stable CSS viewport unit for the current orientation, preferably based on the small viewport so phone browser chrome does not continually resize the article. Read the actual resulting stage and article sizes; do not assume device pixel dimensions equal CSS pixels.

- `I`: sticky top inset.
- `M`: author-selected total-height multiplier, initially `2`; use `4` if the preview needs more room. This is an implementation setting, not a visitor-facing control.
- `H`: article border-box height, `M * V` in enhanced mode.
- `S`: measured stage border-box height, fitting within the usable viewport.
- `D`: pinned scroll distance, `H - S`; approximately one viewport height at `M = 2`, or three at `M = 4`, for a near-full-height stage.
- `A`: article document-top coordinate.
- Keep all article spacing inside the selected total-height budget. Use no extra track spacers, vertical article padding or external inter-project gaps that silently lengthen it; put internal layout padding in the measured stage.
- Pin start: `A - I`; pin end: `A - I + D`.
- Progress: `p = clamp((scrollY - (A - I)) / D, 0, 1)`.

Compute progress from the article's unpinned geometry, never from the moving sticky child's rectangle. Verify `D > 0` before enabling pinning; otherwise use the static fit fallback. For a 900px viewport and an approximately 900px stage, the initial article is 1800px tall with approximately 900px of pinned travel. If doubled, the article is 3600px tall with approximately 2700px of pinned travel. Doubling the total height does not mean doubling only the pinned travel. Sticky inset and measured stage height determine exact travel. Static accessibility/fit fallbacks retain ordinary content-driven height.

Review the first project at the two-height setting using ordinary wheel and touch scrolling. If component arrivals and arrow-led connections cannot be followed without unusually careful scrolling, or the completed diagram passes too quickly, use the authorized four-height setting and repeat the same review. Keep identical phase percentages so the comparison isolates pacing. Record which setting was selected and why; never change track height automatically in response to scroll speed or while an article is active.

### Required state behavior

- Progress is a pure function of the current scroll position. Stopping scroll stops assembly; no timer continues it.
- Reverse scrolling reverses the exact same sequence. Do not re-explode the finished diagram while scrolling forward out of its article.
- Fast wheel input, touch flings, scrollbar drags, PageDown/End and anchor jumps render the destination state immediately. Do not require visitors to witness every intermediate frame.
- Initialize correctly after direct loads into `/#work`, refresh at a restored position, browser Back/Forward restoration and `pageshow`/back-forward cache restore. Do not reset the browser's scroll position.
- Coalesce input into at most one pending animation frame; use passive scroll listeners and batch geometry reads before writes.
- Cancel pending work while the document is hidden. Resume by recomputing from the current position; never replay elapsed time.
- Skip per-node writes for distant inactive studies, but reconcile the old active study and newly active study on large scroll jumps so endpoint states cannot remain stale.
- Recalculate measurements on font readiness, content size changes, orientation changes and meaningful viewport resize. Keep current scroll position and derive the new state; do not animate back from zero.
- Browser-toolbar movement must not repeatedly recreate or resize a pinned track. Use visual viewport information to check fit, not continuously rewrite scroll distance.
- Theme changes update colors without rebuilding the sequence or resetting progress.

## 5. Assembly timeline

All percentages refer to the pinned distance `D = M * V - S`, not the full article height or elapsed seconds. The complete sequence, including its final hold, must fit inside that distance. Use bounded interpolation without spring overshoot, bounce, inertial lag or additional decorative parallax of body copy.

| Progress | Diagram | Completion / CTA |
| --- | --- | --- |
| 0-8% | Hold the contained, separated component layout. All main component names are readable. | Project introduction stays visible; no step notes. |
| 8-52% | Assemble four authored component groups, each using an equal 11% interval. | No explanation-note changes. |
| 52-80% | Components stay fixed. Draw four authored connection groups in equal 7% intervals. | Arrowheads and graph labels convey the connections. |
| 80-100% | Every component and wire is complete; remove temporary step emphasis. | Final CTA available for the entire hold. |

Each component group reaches its exact final position before the next begins. Use a monotonic ease-out within its scroll interval. Internal details move with their parent; do not require their own scrolling budget.

Connection groups can contain several independent edges. Order them by system explanation, not incidental DOM order. Nodes that are already assembled remain legible; current emphasis uses restrained accent/stroke treatment, never a dimming scheme that makes completed text unreadable.

Expose current progress and phase for deterministic browser assertions, for example `data-assembly-progress` and `data-assembly-phase`. These are verification hooks, not controls shown to visitors. Canonical positions and connection data, rather than a debug attribute alone, are the source of rendered truth.

## 6. Detailed schematic content and data

Create home-specific schematic data keyed by project ID. Every project must define:

- Stable node IDs, primary label, optional short internal labels, authored visual shape, final position/size, separated offset and assembly group.
- Desktop and mobile coordinates/offsets with the same node identities and directed connection topology. Mobile may simplify decorative internals, but not lose a branch or change meaning.
- Stable edge IDs, source/destination node and port, routing waypoints or routing hint, draw group and optional relationship label.
- Future note data, if later approved, must remain separate from node/edge animation math. Note fields and authored step prose are not required for the first animation preview.
- A concise semantic diagram summary, explicit schematic caption, placeholder status and CTA metadata.

Use the existing `wirePath()` for simple routes where it remains readable. Support authored orthogonal waypoints when the midpoint router would cross another node or label. Validate source/destination IDs, group assignments and supported variants before enabling an article. Missing preview configuration must preserve the project entry and static content, not silently show another project's drawing.

### Initial content map

| Project | Four component assembly groups | Four connection draw groups | Permitted extra detail |
| --- | --- | --- | --- |
| 01 - Agentic AI Assistant | Request input; prompt guard; Docker sandbox plus scheduler; status dashboard | Request to guard; guard to sandbox; scheduler to sandbox; sandbox to dashboard | Request fields, guard checks, execution/status subdivisions. |
| 02 - Portfolio Website | Browser shell; project view; assistant view; Astro pages/interactions/chat API modules | Page delivery to browser; browser interactions; browser request to chat API; return response to assistant view | Project/filter controls, conversation rows, endpoint ports. |
| 03 - Task Automation Bot | File rules; schedule; CLI worker; SQLite/audit outputs | Rules to worker; schedule to worker; worker to SQLite; worker to audit output | Rule examples, job slots, worker stages, log rows. |

This is an illustrative storytelling map based on the current schematic vocabulary, not verified deployed topology. In particular, project 02 must distinguish the page-delivery direction from browser-initiated API requests, and project 03's storage/audit relationship must not be presented as a verified separate service boundary.

The owner explicitly permits filler details. Mark the board "Illustrative architecture - details pending" while such content remains. Keep sample labels localized to preview data; author future notes only after the owner decides to include them. Do not alter factual project descriptions, claim measured results, invent real URLs, embed credentials or present example infrastructure as confirmed implementation. Before treating these studies as factual architecture, replace examples with owner-reviewed details or retain their illustrative labeling.

### Completed-state requirement

Every final node, internal label, port, wire, arrowhead and relationship label fits the authored viewBox. Connections do not pass through unrelated boxes or text. All branches are visible at once and the drawing is comprehensible without explanation notes. No steps disappear in the final state and there is no endless signal animation after completion.

## 7. Progressive wires and advancing arrowheads

A dashed reveal with a normal end marker is insufficient: that marker would sit at the final destination while the visible line is still drawing.

1. Route each full wire from its semantic source port to destination port.
2. Once nodes have settled, cache path length `L`. Reveal the leading segment with stroke-dasharray/dashoffset or an equivalent trim technique.
3. At local draw progress `t`, place the moving arrowhead at path distance `t * L`.
4. Orient it using a short forward/backward sample of the path tangent, with deterministic behavior at corners and zero-length segments. Use source-to-destination orientation even when reverse scrolling erases the wire; reverse scrolling is not a different data-flow claim.
5. Hide the moving head at zero progress. At completion it becomes the sole static head at the destination; do not leave duplicate arrows.
6. Recompute lengths and sampling only when geometry changes; ordinary scroll updates use the cached route. Keep incoming and outgoing ports visibly distinct if bidirectional flow is shown.
7. Keep moving-head coordinates in SVG user space with the path. Ensure the destination arrowhead does not overlap the node's label or disappear under a fill.
8. Use unique per-project IDs for SVG definitions/markers and prevent clashes between desktop and mobile instances.

If future choreography allows a wire to exist while its nodes are moving, rebuild both its route and reveal geometry from those same current positions. The initial implementation deliberately finishes node assembly before wire drawing to avoid that extra complexity.

## 8. Desktop preview, deferred notes and mobile adaptation

### Desktop / first animation preview

- Project introduction above; a large schematic uses the available stage width below, followed by the completion CTA area.
- No note rail, note strip, changing explanatory prose or empty note placeholder. Normal component labels and the graph's accessible summary remain.
- Show the separated state, detailed component assembly, advancing arrowheads, complete final state and handoff so the owner can judge the motion itself.
- After this preview, ask the owner whether notes are needed and, if so, decide their count, position and relationship to the sequence using the visible animation as evidence. Earlier four-milestone and side-rail suggestions are unselected possibilities, not requirements.
- Adding notes later requires a fresh stage-fit and pacing check; their layout must not be silently predetermined by the first implementation.

### Phones / narrow layouts

- Keep the title and complete description above a dedicated compact schematic inside the pinned stage. Do not show explanation notes; retain primary diagram labels, relationship direction and semantic summary.
- Recompose nodes for a portrait drawing, with real branches and ports. Do not merely scale the desktop SVG into tiny text or substitute an incomplete list of stages.
- Use four semantic assembly groups and the same timeline/arrow behavior. Reduce separation distances to remain within the smaller viewBox.
- Target primary labels at 12 CSS pixels or larger at the tested 390px viewport; omit optional decorative microcopy before shrinking essential labels. Check actual rendered sizes after SVG scaling.
- Show the entire completed compact graph during the final hold, together with the CTA. Keep it clear of the assistant launcher and device safe areas.
- Mobile node labels and the stable summary must carry the explanation without visible step notes. Do not add the desktop prose rail below the mobile drawing.

### Fit exception

Evaluate whether the full title, full description, readable final graph, required gaps and CTA fit in the usable viewport. If they cannot, switch that article to complete static content in ordinary flow. This includes very short landscape windows, 320px constraints where necessary, enlarged text and 200% zoom. Do not truncate project copy, shrink critical text, hide graph branches or introduce nested scrolling to force pinning.

This exception preserves the requested pinned mobile experience wherever it can be readable. Record every fallback trigger in verification; do not quietly make all phones static.

## 9. CTA and keyboard behavior

Confirmed CTA contract: a normal link labeled "View [project title]" to `/projects#project-{id}`. Add stable IDs on the matching catalog articles and an appropriate scroll margin. All catalog records are initially present and visible; retain current filter behavior and saved gallery/list preference. The CTA does not claim to open a standalone case study.

- Reserve its space in the sticky stage from the start, but expose it visually and to focus only in the final hold during enhanced animation.
- Place a completion anchor immediately after the sticky stage within the article at the end of its track. A nonvisual, keyboard-focusable "Project details" link before the stage targets that anchor, allowing keyboard users to reach the completed view and then its CTA without tabbing into a visually hidden element. This is a keyboard accommodation, not a visible skip-animation control for ordinary scrolling.
- Focusing that completion anchor or the final CTA must reconcile to completed progress and a viewport position where both control and completed drawing are visible; test the actual scroll destination rather than assuming native focus scroll gets it right.
- No animation-driven focus movement and no automatic modal opening. Preserve normal Tab, Shift+Tab, Enter, Space and browser navigation behavior.
- Without JavaScript or with static fallbacks, show the CTA immediately after the full diagram and preserve the standard link behavior.
- Existing global links to About/contact, browser End and assistive navigation remain functional. "Mandatory scroll" means no ordinary bypass control inside the experience, not wheel interception or locking the rest of the site until playback finishes.

The final CTA navigates to the catalog entry. Existing catalog detail-dialog buttons remain available there, with their current native-dialog focus behavior.

## 10. Progressive enhancement and accessibility

- Server-render the complete diagrams, titles, descriptions, static semantic explanation and CTAs. This is the default no-JavaScript and initialization-error view.
- Enable pinned height, exploded positions and conditional CTA exposure only after an article's data, elements, geometry and fit checks succeed. An exception restores that article's static state and removes enhancement styles.
- Reduced motion shows the complete assembled drawing and ordinary-height content without scroll assembly. Respond to changes in the preference at runtime and remove hidden/disabled CTA states immediately.
- When reduced motion is turned off mid-page, establish the current geometry and scroll-derived state without a timer or a forced scroll to the start. Reflow caused by the track-height change must be checked for lost focus/content.
- Provide a concise semantic graph summary and relationship descriptions without duplicate visible/announced variants. If step notes are later approved, define their accessible reading order without scroll-triggered live announcements. Give the visual SVG a concise name and description; do not make moving nodes keyboard stops.
- Keep visible focus and legible contrast in both themes. Arrow movement supplements explicit direction, not color alone.
- No hover-only explanations, horizontal page overflow, flashing, timed content gates or hidden essential project information.
- Do not use `content-visibility` or containment settings that break sticky sizing or anchor navigation.

## 11. Implementation structure and controller ownership

Suggested responsibilities; keep the file count proportional to the actual implementation:

| File | Planned responsibility |
| --- | --- |
| `src/pages/index.astro` | Select IDs 01/02/03 explicitly; render project assembly articles; remove its duplicated legacy diagram controller. |
| `src/components/ProjectAssembly.astro` (new) | Server-render one article, sticky stage, introduction, completion area and fallback structure; omit note UI in the first preview. Include one bundled vanilla controller for all home assembly articles. |
| `src/components/AssemblyFigure.astro` (new) | Home-specific detailed SVG, desktop/mobile composition, edge/head elements and semantic summary. Preserve `ProjectFigure.astro` for catalog drawings. |
| `src/data/projectPreviews.ts` (new) | Typed preview nodes, routes/ports, assembly groups, placeholder flags and stable project associations. Future notes remain separate if later selected. |
| `src/utils/projectAssembly.ts` (new, if useful) | Pure phase/progress calculations and data validation, with no global listeners. Keep DOM work in the Astro component. |
| `src/components/ScrollDrafting.astro` | Explicitly target legacy/catalog diagrams only. It must never discover or mutate new assembly nodes. |
| `src/styles/global.css` | Scoped assembly styles, configurable two/four-height sizing, mobile rules, completion/focus and static/reduced-motion fallbacks. Preserve catalog styles. |
| `src/pages/projects.astro` | Stable article anchor IDs for the confirmed catalog-entry CTAs. |
| `tests/project-assembly.spec.ts` (new) | New semantic, geometry, lifecycle, direction, fallback, CTA and responsive browser checks. |
| `tests/portfolio.spec.ts` | Update home-specific old explode-motion assertions; retain or split out catalog motion coverage. Reconcile directly relevant invalid catalog indices. |
| Vault `SURFACE.md`, `DESIGN.md`, `spec.md` | On implementation, record the homepage-specific replacement of explode/reassemble motion. Keep catalog contracts separate. |
| Vault `VERIFICATION.md`, `docs/build-log.md`, `log.md` | Record actual verification, decisions, remaining illustrative content and any unresolved baseline failures. |

Use assembly-specific selectors such as `[data-project-assembly]` and `[data-assembly-node]`; do not reuse `[data-diagram]` for the new controller. Scope legacy selection explicitly. Ensure only one controller installs listeners even when the Astro assembly component is rendered three times. If navigation lifecycle support is needed, dispose/reinitialize listeners and observers without duplication.

Keep all preview data serialized safely if embedded in HTML: escape `<` in JSON as existing project-modal code does. Render labels and notes as text, not executable markup from placeholder fields.

## 12. Implementation sequence

1. **Record baseline against the latest contract.** Confirm current source IDs, controller duplication and relevant test failures. Use catalog-entry CTA anchors, begin at two viewport heights total, allow four if needed, and defer note UI. No further note-design round precedes the animation preview.
2. **Author a static proof for project 01.** Build its detailed desktop and portrait completed diagrams first. Verify labels, topology and arrows at actual sizes. A complete readable end state is a prerequisite for animation.
3. **Build the first animation review milestone on project 01.** Use the reusable data model/stage with no notes. Implement node assembly, arrow-led wire drawing, complete final hold and release; compare two total screen heights and, if rushed, four. Record the chosen pacing and show desktop/mobile motion before requesting any note decision.
4. **Establish layout resilience.** Verify article/stage sizing, introduction, reserved CTA area, natural handoff, static fit fallback and no-JavaScript rendering. Do not reserve an empty note area.
5. **Apply the verified animation structure to all three studies.** Add the other two preview data sets and summaries. Maintain one controller, four component groups, four connection groups and final hold; remove home duplication and exclude new markup from legacy motion.
6. **Add resilience.** Complete resize/fonts/visibility/pageshow handling, reduced-motion changes, rollback on initialization failure and keyboard completion navigation.
7. **Connect catalog destinations.** Add stable catalog-entry anchors, link each completed study to its matching entry and verify navigation in both gallery and list views.
8. **Verify in bounded passes.** Batch desktop/mobile/theme/motion captures and regression checks; fix observed defects together, then confirm once. Do not polish unrelated surfaces.
9. **Update records and request only the deferred note decision.** Record the selected total height, what shipped and what remains illustrative. After the owner has seen the animation, resume discussion of desktop explanations; do not treat their absence as a failed first-preview requirement. Run QC after final edits and append both mandatory logs.

The original planning session did not authorize source changes. The owner subsequently requested implementation of this plan on 2026-10-19. Publication, commits and pushes remain outside this delivery.

## 13. Verification and acceptance criteria

### Required commands during implementation

- `npm run qc`: all five gates, including production build and `nodejs22.x` output verification.
- `npm run test:api`: preserve current API fixture behavior as required by the project instructions.
- `npm run test:browser`: review the full result and classify failures; also run the focused assembly suite independently for an unambiguous result.
- `npm run test:physics` only if shared background/geometry behavior is actually changed or a demonstrated regression requires it.
- Start the review server with `npm run dev:review` and verify an HTTP response at port 4322 before browser checks. Tests currently use installed Chromium via the Playwright configuration.

The latest recorded full browser baseline is 32 passed / 23 failed (2026-10-17). Reported failures include nonexistent catalog indices and absent journal animated-heading elements. This is historical evidence, not a fresh result. Recheck the baseline before implementation, preserve unrelated work, and do not claim a fully green suite based only on focused passes. Fix directly affected obsolete home assertions; list unrelated stale fixtures separately unless their reconciliation is explicitly included.

### Browser coverage matrix

| Area | Required evidence |
| --- | --- |
| Standard layouts | 1440x900 and 390x844, both themes; all three projects. |
| Tight layouts | 320px width, short desktop window, phone landscape and 200% zoom; verify pinned or documented fit fallback. |
| Sequence geometry | Two viewport heights total initially, or four if selected after the pacing review; pinned travel equals article height minus stage height. Check entry, each component boundary, each connection boundary, final hold and inter-project handoff. |
| Input | Wheel, real touch gesture where available, keyboard PageDown/End, scrollbar/direct scroll jumps and reverse scrolling. Programmatic scroll alone is not proof of touch-gesture behavior. |
| Navigation | Direct `/#work`, restored-scroll refresh, browser Back/Forward, completion focus path, final CTA and correct target entry. |
| Lifecycle | Font load, resize/orientation mid-assembly, hidden/resumed document, runtime reduced-motion changes and both themes without progress reset. |
| Static paths | No JavaScript, reduced motion and simulated per-article initialization failure: full graph/content/CTA visible with no long empty track. |
| Shared regression | `/projects` gallery/list, combined filters, legacy schematic motion, details dialog focus/Escape, assistant usability, existing hero/background behavior. |

### Meaningful geometry assertions

- At final progress, node transforms equal authored final positions, every edge is fully drawn, every destination has exactly one correctly oriented arrow and no temporary head remains.
- At intermediate wire progress, the arrow is at the visible stroke tip, not at the hidden final destination; check several points including a bend. At start it is hidden.
- Wire endpoints match source/destination ports within 1 CSS pixel after screen transformation. Check both ends and every directed edge, not only the first wire start.
- The full final graph, labels and arrows fit within the board and visible stage; there is no clipped text, hidden branch or horizontal page overflow. Visually inspect label crossings; bounding-box checks alone cannot establish legibility.
- Progress and transforms are equivalent when reaching the same position by forward scroll, reverse scroll, rapid jump or restored navigation.
- Exactly one stage controls its own diagram; stage handoff does not overlay titles or leave the previous article pinned.
- The final hold begins at 80% and remains complete through release. CTA appears for that full hold and is reachable by keyboard/static paths.
- Mobile contains the same essential components and directed branches as desktop. The first animation preview renders no changing explanation notes on either layout.
- Updating placeholder copy does not require changing animation logic; the longest title/description is included in fit verification. Future notes require a separate fit review after their design is decided.

### Performance and diagnostics

- No continuous frame loop for these studies while scroll and layout are idle. Only active/nearby states receive ordinary scroll writes; zero-length or invalid routes cannot produce NaN coordinates.
- Record a bounded scroll trace alongside the already animated workbench. Look for repeated forced layout and work exceeding a 16.7ms frame budget on the review machine; report evidence and any misses rather than guaranteeing 60fps on every device.
- No new unhandled errors, warnings or failed requests from the assembly. Identify pre-existing framework/build warnings separately rather than declaring a silent console without evidence.
- Save final-state screenshots and a short entry/assembly/handoff recording for desktop and phone. Report simulated/device limitations honestly; Chromium emulation is not real iOS Safari verification.

### Definition of done

The first animation review milestone is complete when project 01 demonstrates detailed assembly, advancing arrowheads, the readable finished diagram and handoff on desktop/mobile, with pacing reviewed at two total viewport heights and four if needed. No desktop note design is required for this milestone.

The full homepage assembly delivery is complete when all three studies use the recorded two- or four-viewport-total setting and catalog-entry CTAs; complete readable desktop/mobile diagrams, deterministic scroll/reverse behavior, static fallbacks and handoff are verified; QC and required relevant tests pass; unrelated baseline failures and illustrative details are disclosed; and canonical contracts plus both logs are updated. Desktop notes remain explicitly deferred until the owner has seen and discussed the motion; do not claim their final design has been resolved.

## Appendix A - Owner's original requirements and answers

The text below is preserved as supplied before this plan was written.

# Project Preview Rework Goal

I want to do rework on the project preview section of the home page. I want to implement a parallax scrolling animation for the project preview section to make the scroll immersive. 

When the user scroll down and enter the project preview section, the parallax aimation started. 

The project header and description (each project's title) should reveal and move up just like the normal scroll, when it get to the top, it should stick there and act as the header. 

The key and main feature of this implementation is the schematic, as the user scroll through the project feature section the schematic should assemble it self via the parallax scroll animation. It should assemble it self in detail and with notes explaining each part of the schematic 

As the end of a project and the start of the next, repeat the step above.

### What should stay pin?

Each project title and description should stick while the schematic assembling beneath them. And "Selected work" should scroll away normally.

### What does "assemble in detail" look like?

The components begin separated, slide into possition, then wire connect them. I will needed more detail than the current schematic. You can use filler detail and information for now, I add in the reeal project detail later. 
The line should connect from start to end. The head of the line should be an arrow pointing in the direction that the line is moving. 

### How should explainations work?

The note should change as each component assembles, as for the position and animation for it, i am unclear for now and I would like some suggestion. 

### How much scrolling should one project require? 

Two view port heights. The scroll is manadatory, but the at the end of each project, there should be a call to action button that give the user option to go to the project page. 

### What experience do I want on phone?

The same pinned assembly, adapted to a smaller composition, but no explaination notes. 

# Note

The diagram should assemble into a whole completed readable diagram!
