import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import jmViewport from '../src/core/jmViewport.js';

describe('jmViewport 坐标转换', () => {
  test('worldToScreen / screenToWorld 互逆', () => {
    const vp = new jmViewport(800, 600, { scaleFactor: 2, x: 100, y: -50 });
    const w = { x: 30, y: 40 };
    const s = vp.worldToScreen(w);
    assert.equal(s.x, 30 * 2 + 100);
    assert.equal(s.y, 40 * 2 - 50);
    const back = vp.screenToWorld(s);
    assert.ok(Math.abs(back.x - w.x) < 1e-9);
    assert.ok(Math.abs(back.y - w.y) < 1e-9);
  });

  test('未变换时 worldToScreen 恒等', () => {
    const vp = new jmViewport(800, 600);
    assert.equal(vp.transformed, false);
    const s = vp.worldToScreen({ x: 5, y: 6 });
    assert.deepEqual(s, { x: 5, y: 6 });
  });
});

describe('jmViewport 视口剔除', () => {
  test('isVisible 识别可见/不可见（世界坐标）', () => {
    const vp = new jmViewport(800, 600, { scaleFactor: 2, x: 0, y: 0 });
    // 世界坐标 [0..400] 对应屏幕 [0..800]，可见
    assert.equal(vp.isVisible({ left: 0, top: 0, right: 100, bottom: 100 }), true);
    // 世界坐标 [1000..1100] 对应屏幕 [2000..2200]，超出画布
    assert.equal(vp.isVisible({ left: 1000, top: 0, right: 1100, bottom: 100 }), false);
  });

  test('平移后剔除结果跟随视口', () => {
    const vp = new jmViewport(800, 600);
    vp.pan(500, 0);
    // 平移 500px 后，世界坐标 0..100 对应屏幕 500..600，仍可见
    assert.equal(vp.isVisible({ left: 0, top: 0, right: 100, bottom: 100 }), true);
    // 世界坐标 -600..-500 对应屏幕 -100..0，右边缘恰好到 0，不可见（完全在视口左侧）
    assert.equal(vp.isVisible({ left: -600, top: 0, right: -500, bottom: 100 }), false);
    // 世界坐标 -590..-490 对应屏幕 -90..10，与视口相交，可见
    assert.equal(vp.isVisible({ left: -590, top: 0, right: -490, bottom: 100 }), true);
    // 世界坐标 -800..-700 对应屏幕 -300..-200，不可见
    assert.equal(vp.isVisible({ left: -800, top: 0, right: -700, bottom: 100 }), false);
  });

  test('zoomAt 保持中心点屏幕位置不变', () => {
    const vp = new jmViewport(800, 600, { scaleFactor: 1, x: 0, y: 0 });
    const worldCenter = { x: 200, y: 150 };
    const before = vp.worldToScreen(worldCenter);
    vp.zoomAt(2.5, worldCenter.x, worldCenter.y);
    const after = vp.worldToScreen(worldCenter);
    assert.ok(Math.abs(after.x - before.x) < 1e-9);
    assert.ok(Math.abs(after.y - before.y) < 1e-9);
    assert.equal(vp.scaleFactor, 2.5);
  });

  test('zoomAt 限制在 minZoom/maxZoom 范围内', () => {
    const vp = new jmViewport(800, 600, { minZoom: 0.1, maxZoom: 10 });
    vp.zoomAt(100);
    assert.equal(vp.scaleFactor, 10);
    vp.zoomAt(0.001);
    assert.equal(vp.scaleFactor, 0.1);
  });
});

describe('jmViewport fitBounds', () => {
  test('内容自适应缩放并居中', () => {
    const vp = new jmViewport(800, 600);
    vp.fitBounds({ left: 0, top: 0, right: 400, bottom: 300 }, 0);
    // 内容 400x300，画布 800x600，正好 2 倍
    assert.ok(Math.abs(vp.scaleFactor - 2) < 1e-9);
    // 内容中心 (200,150) 应在屏幕中心 (400,300)
    const c = vp.worldToScreen({ x: 200, y: 150 });
    assert.ok(Math.abs(c.x - 400) < 1e-9);
    assert.ok(Math.abs(c.y - 300) < 1e-9);
  });

  test('空边界重置视口', () => {
    const vp = new jmViewport(800, 600);
    vp.pan(10, 20).zoomAt(2);
    vp.fitBounds(null, 0);
    assert.equal(vp.scaleFactor, 1);
    assert.equal(vp.translation.x, 0);
    assert.equal(vp.translation.y, 0);
  });
});

describe('jmViewport stamp 版本号', () => {
  test('变换后 stamp 自增', () => {
    const vp = new jmViewport(800, 600);
    const s0 = vp.stamp;
    vp.pan(1, 2);
    assert.ok(vp.stamp > s0);
    vp.zoomAt(2);
    assert.ok(vp.stamp > s0);
  });
});
