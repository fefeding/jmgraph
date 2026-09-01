import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import jmSpatialIndex from '../src/core/jmSpatialIndex.js';

// 构造一个最小可用的伪控件
const fakeControl = (id, left, top, width = 10, height = 10) => ({
  id,
  absoluteBounds: { left, top, right: left + width, bottom: top + height, width, height },
  style: { lineWidth: 1 }
});

describe('jmSpatialIndex 基本操作', () => {
  test('插入后 query 能命中', () => {
    const idx = new jmSpatialIndex(100);
    const a = fakeControl('a', 10, 10);
    idx.upsert(a);
    const hit = idx.query({ x: 15, y: 15 });
    assert.ok(hit && hit.has(a));
  });

  test('跨网格单元的大控件可被查询到', () => {
    const idx = new jmSpatialIndex(100);
    const big = fakeControl('big', 0, 0, 350, 350); // 覆盖多个单元
    idx.upsert(big);
    const hit = idx.query({ x: 250, y: 250 });
    assert.ok(hit && hit.has(big));
  });

  test('移除后不再命中', () => {
    const idx = new jmSpatialIndex(100);
    const a = fakeControl('a', 10, 10);
    idx.upsert(a);
    idx.remove(a);
    const hit = idx.query({ x: 15, y: 15 });
    assert.equal(hit, null);
    assert.equal(idx.size, 0);
  });

  test('upsert 覆盖更新边界', () => {
    const idx = new jmSpatialIndex(100);
    const a = fakeControl('a', 10, 10);
    idx.upsert(a);
    // 同一控件对象移动到远处后 upsert 更新
    a.absoluteBounds = { left: 900, top: 900, right: 910, bottom: 910, width: 10, height: 10 };
    idx.upsert(a);
    assert.equal(idx.query({ x: 15, y: 15 }), null);
    const hit = idx.query({ x: 905, y: 905 });
    assert.ok(hit && hit.has(a));
  });

  test('queryRect 返回与矩形相交的所有控件', () => {
    const idx = new jmSpatialIndex(100);
    const a = fakeControl('a', 10, 10);
    const b = fakeControl('b', 500, 500);
    idx.upsert(a);
    idx.upsert(b);
    const hits = idx.queryRect({ left: 0, top: 0, right: 50, bottom: 50 });
    assert.ok(hits.has(a));
    assert.ok(!hits.has(b));
  });

  test('clear 清空所有', () => {
    const idx = new jmSpatialIndex(100);
    idx.upsert(fakeControl('a', 10, 10));
    idx.upsert(fakeControl('b', 500, 500));
    idx.clear();
    assert.equal(idx.size, 0);
    assert.equal(idx.query({ x: 15, y: 15 }), null);
  });
});
