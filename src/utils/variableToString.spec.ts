import { variableToString } from "./variableToString";

describe("variableToString", () => {
  it("should return the key of the object", () => {
    const foo = "bar";
    expect(variableToString({ foo })).toEqual("foo");
  });
});
