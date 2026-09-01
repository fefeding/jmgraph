import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { jmControl } from '../src/core/jmControl.js';
import { jmList } from '../src/core/jmList.js';

describe('jmList', () => {
  test('add/remove/contain 基本行为', () => {
    const list = new jmList();
    const a = {};
    const b = {};
    list.add(a);
    list.add(b);
    assert.equal(list.length, 2);
    assert.ok(list.contain(a));
    list.remove(a);
    assert.equal(list.length, 1);
    assert.ok(!list.contain(a));
  });

  test('addAll 批量添加', () => {
    const list = new jmList();
    list.addAll([1, 2, 3]);
    assert.equal(list.length, 3);
    assert.deepEqual([...list], [1, 2, 3]);
  });
});

describe('jmControl 层级与边界', () => {
  test('children.add 建立父子关系', () => {
    const parent = new jmControl({});
    const child = new jmControl({});
    parent.children.add(child);
    assert.equal(child.parent, parent);
    assert.equal(parent.children.length, 1);
    assert.equal(parent.__childrenSortDirty, true);
  });

  test('children.addAll 批量建立关系', () => {
    const parent = new jmControl({});
    const a = new jmControl({});
    const b = new jmControl({});
    parent.children.addAll([a, b]);
    assert.equal(parent.children.length, 2);
    assert.equal(a.parent, parent);
    assert.equal(b.parent, parent);
  });

  test('getBounds 返回基于宽高的矩形', () => {
    const c = new jmControl({ width: 100, height: 50 });
    const b = c.getBounds();
    assert.equal(b.width, 100);
    assert.equal(b.height, 50);
    // 缓存命中
    assert.equal(c.getBounds(), b);
  });

  test('getBounds 脏标记后重算', () => {
    const c = new jmControl({ width: 100, height: 50 });
    const b1 = c.getBounds();
    c.__boundsDirty = true;
    const b2 = c.getBounds();
    assert.notEqual(b1, b2);
    assert.equal(b2.width, 100);
  });

  test('getAbsoluteBounds 递归计算父级偏移', () => {
    const parent = new jmControl({ position: { x: 100, y: 50 }, width: 200, height: 100 });
    // 手动给出父级 absoluteBounds（模拟 paint 后的状态）
    parent.absoluteBounds = { left: 100, top: 50, right: 300, bottom: 150, width: 200, height: 100 };
    const child = new jmControl({ position: { x: 10, y: 20 }, width: 50, height: 30 });
    parent.children.add(child);
    child.absoluteBounds = child.getAbsoluteBounds();
    const ab = child.getAbsoluteBounds();
    assert.equal(ab.left, 110);
    assert.equal(ab.top, 70);
    assert.equal(ab.right, 160);
    assert.equal(ab.bottom, 100);
  });

  test('getAbsoluteBounds 缓存命中', () => {
    const c = new jmControl({ width: 100, height: 50 });
    c.absoluteBounds = c.getAbsoluteBounds();
    const cached = c.getAbsoluteBounds();
    assert.equal(c.getAbsoluteBounds(), cached);
  });

  test('offset 修改 position', () => {
    const c = new jmControl({ position: { x: 10, y: 20 } });
    c.offset(5, -3);
    assert.equal(c.position.x, 15);
    assert.equal(c.position.y, 17);
  });
});

describe('jmControl 命中检测', () => {
  test('无 points 控件按边界矩形命中', () => {
    const c = new jmControl({ position: { x: 0, y: 0 }, width: 100, height: 100 });
    c.absoluteBounds = { left: 0, top: 0, right: 100, bottom: 100, width: 100, height: 100 };
    assert.equal(c.checkPoint({ x: 50, y: 50 }), true);
    assert.equal(c.checkPoint({ x: 150, y: 50 }), false);
  });

  test('hitArea 优先于边界', () => {
    const c = new jmControl({ position: { x: 0, y: 0 }, width: 10, height: 10 });
    c.hitArea = { x: 0, y: 0, width: 100, height: 100 };
    assert.equal(c.checkPoint({ x: 50, y: 50 }), true);
  });
});

describe('jmControl 样式快照', () => {
  test('样式未变化时 setStyle 可跳过', () => {
    const c = new jmControl({});
    c._snapshotStyle({ fill: '#f00', lineWidth: 1 });
    assert.equal(c._styleUnchanged({ fill: '#f00', lineWidth: 1 }), true);
    assert.equal(c._styleUnchanged({ fill: '#00f', lineWidth: 1 }), false);
  });

  test('函数样式不参与快照', () => {
    const c = new jmControl({});
    c._snapshotStyle({ fill: '#f00' });
    assert.equal(c._styleUnchanged({ fill: () => '#00f' }), false);
  });
});
