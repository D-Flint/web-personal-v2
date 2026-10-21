import { test, expect } from '@playwright/test';
import { projectPreviews } from '../src/data/projectPreviews';

function expectSymmetricPorts(ports: { x: number; y: number }[], width: number, height: number, label: string) {
  for (const side of ['left', 'right', 'top', 'bottom']) {
    const vertical = side === 'left' || side === 'right';
    const positions = ports
      .filter(port => vertical ? port.x === (side === 'left' ? 0 : width) : port.y === (side === 'top' ? 0 : height))
      .map(port => vertical ? port.y : port.x)
      .sort((a, b) => a - b);
    for (let i = 0; i < positions.length; i++) {
      expect(positions[i] + positions[positions.length - 1 - i], `${label} ${side}`).toBeCloseTo(vertical ? height : width, 5);
    }
  }
}

test('all schematic inputs and outputs are symmetric around their block edges', () => {
  for (const preview of Object.values(projectPreviews)) for (const layout of ['desktop', 'mobile'] as const) {
    for (const node of preview.nodes) {
      const box = node[layout];
      const ports = preview.edges.flatMap(edge => {
        const point = edge.from === node.id ? edge[layout][0] : edge.to === node.id ? edge[layout].at(-1) : null;
        return point ? [{ x: point.x - box.x, y: point.y - box.y }] : [];
      });
      expectSymmetricPorts(ports, box.w, box.h, `${preview.id} ${layout} ${node.id}`);
    }
  }
});

for (const width of [1440, 390]) for (const route of ['/', '/projects']) {
  test(`rendered ports remain symmetric and attached on ${route} at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: width === 1440 ? 900 : 844 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(route, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const figures = page.locator('.assembly-figure');
    expect(await figures.count()).toBe(route === '/' ? 3 : 4);
    for (const figure of await figures.all()) {
      await figure.scrollIntoViewIfNeeded();
      const svg = figure.locator('.assembly-svg:visible');
      const geometry = await svg.evaluate(svg => {
        const nodes = Array.from(svg.querySelectorAll<SVGGElement>('[data-assembly-node]'));
        return nodes.map(node => {
          const box = node.querySelector('rect')!;
          const ports = Array.from(node.querySelectorAll<SVGCircleElement>('.assembly-port'));
          const endpoints = Array.from(svg.querySelectorAll<SVGPathElement>('[data-assembly-wire]')).flatMap(wire => [wire.getPointAtLength(0), wire.getPointAtLength(wire.getTotalLength())].map(point => point.matrixTransform(wire.getScreenCTM()!)));
          return {
            id: node.dataset.assemblyNode,
            width: box.width.baseVal.value,
            height: box.height.baseVal.value,
            ports: ports.map(port => ({ x: port.cx.baseVal.value, y: port.cy.baseVal.value })),
            gaps: ports.map(port => {
              const center = new DOMPoint(port.cx.baseVal.value, port.cy.baseVal.value).matrixTransform(port.getScreenCTM()!);
              return Math.min(...endpoints.map(endpoint => Math.hypot(center.x - endpoint.x, center.y - endpoint.y)));
            }),
          };
        });
      });
      for (const node of geometry) {
        expectSymmetricPorts(node.ports, node.width, node.height, node.id!);
        for (const gap of node.gaps) expect(gap).toBeLessThan(.1);
      }
      const id = await figure.locator('svg title').first().getAttribute('id');
      await figure.screenshot({ path: `.impeccable/review/symmetric-ports/${route === '/' ? 'home' : 'catalog'}-${width}-${id}.png` });
    }
  });
}
