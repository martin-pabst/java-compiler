/**::
 * Operator precedence
 */

int a = 10;
int b = 20;

int c = b/a + 5;
assertEquals(7, c, "Precedence / before + not working.");

int n = 0;

double d = a + 3 / b * n;
assertEquals(10.0, d, "Operators with identical precedence are not evaluated left to right.");


/**::
 * Vector2
 */
Vector2 v1 = new Vector2(1, 2);
Vector2 v2 = new Vector2(3, 4);

assertTrue(v2.minus(v1).equals(new Vector2(2, 2)), "Vector2.minus");
assertTrue(v2.plus(v1).equals(new Vector2(4,6)), "Vector2.plus");
// plus, minus don't alter vectors but create new ones:
assertTrue(v1.equals(new Vector2(1,2)), "Vector2.minus does alter vector");
assertTrue(v2.equals(new Vector2(3,4)), "Vector2.minus does alter vector");

assertTrue(v1.add(v2).equals(new Vector2(4, 6)), "Vector2.add");
assertTrue(v1.equals(new Vector2(4, 6)), "Vector2.add doesn't alter vector");

Vector2 v3 = new Vector2(3, 4);
assertEquals(5, v3.getLength(), "Vector2.getLength()");
assertEquals(10, v3.scaledBy(2).getLength(), "Vector2.scaledBy");
assertTrue(v3.equals(new Vector2(3, 4)), "Vector2.scaledBy");
v3.scale(2);
assertTrue(v3.equals(new Vector2(6, 8)), "Vector2.scale");
v3.setLength(2);
assertEquals(2, v3.getLength(), "Vector2.setLength() and getLength()");

Vector2 v4 = new Vector2(3, 4);
assertTrue(v4.rotatedBy(90).equals(new Vector2(-4, 3)), "Vector2.rotatedBy");
assertTrue(v4.equals(new Vector2(3, 4)), "Vector2.rotatedBy doesn't alter vector");
v4.rotate(-90);
assertTrue(v4.equals(new Vector2(4, -3)), "Vector2.rotate");
assertEquals(1, v4.getUnitVector().getLength(), "Vector2 -> unit vector");


