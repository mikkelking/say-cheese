//Tests
Tinytest.add('say-cheese initalized', function (test) {
  test.isNotNull(SayCheese, 'SayCheese should exist');
console.log(SayCheese);
 var sayCheese = new SayCheese;
//var sayCheese = new SayCheese('#container-element', { snapshots: true });
//console.log(sayCheese);
  test.isTrue(typeof(sayCheese.start) === "function", 'sayCheese.start should be a function');
  test.isTrue(typeof(sayCheese.start) === "function", 'sayCheese.start should be a function');
//  test.isTrue(typeof(sayCheese.on) === "function", 'sayCheese.on should be a function');
});
