const FLOW_TRAVEL_MS = 900;
const FLOW_GAP_MS = 180;
const FLOW_REST_MS = 900;

// Both surfaces share packet timing. The caller owns completeness and visibility;
// browser animations leave every node, full connection and arrowhead fixed.
export function createSchematicFlow(svgs: SVGSVGElement[], order: number[]) {
  const layouts = svgs.map(svg => ({
    svg,
    packets: Array.from(svg.querySelectorAll<SVGPathElement>('[data-assembly-packet]')),
    animations: [] as Animation[],
  }));

  function sync(complete: boolean, visible: boolean) {
    for (const layout of layouts) {
      const running = complete && visible && !document.hidden && layout.svg.getClientRects().length > 0;
      if (running && !layout.animations.length) {
        const duration = order.length * (FLOW_TRAVEL_MS + FLOW_GAP_MS) + FLOW_REST_MS;
        for (const [slot, index] of order.entries()) {
          const start = slot * (FLOW_TRAVEL_MS + FLOW_GAP_MS) / duration;
          const end = start + FLOW_TRAVEL_MS / duration;
          const animation = layout.packets[index].animate([
            { offset: 0, strokeDashoffset: '.06', opacity: 0 },
            { offset: start, strokeDashoffset: '.06', opacity: 0 },
            { offset: start + .008, strokeDashoffset: '0', opacity: 1 },
            { offset: end - .008, strokeDashoffset: '-.94', opacity: 1 },
            { offset: end, strokeDashoffset: '-1', opacity: 0 },
            { offset: 1, strokeDashoffset: '-1', opacity: 0 },
          ], { duration, iterations: Infinity, easing: 'linear' });
          animation.currentTime = 0;
          layout.animations.push(animation);
        }
      }
      for (const animation of layout.animations) {
        if (running && animation.playState !== 'running') animation.play();
        else if (!running && animation.playState !== 'paused') animation.pause();
        if (!complete) animation.currentTime = 0;
      }
    }
  }

  return {
    sync,
    dispose() {
      for (const layout of layouts) for (const animation of layout.animations) animation.cancel();
    },
  };
}
