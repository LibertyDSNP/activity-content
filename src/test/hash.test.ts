import { bytes } from "multiformats/basics";
import { toMultibaseHash, toMultibase, fromMultibase } from "../utilities/hash";

describe("toMultibaseHash", () => {
  it("hashes sha2-256 correctly", async () => {
    expect(await toMultibaseHash("multihash", "sha2-256")).toMatch(
      "zQmYtUc4iTCbbfVSDNKvtQqrfyezPPnFvE33wFmutw9PBBk"
    );
  });

  it("hashes blake2b correctly ABC", async () => {
    const mb = await toMultibaseHash("abc", "blake2b-256");
    const fromMbHash = fromMultibase(mb);
    expect("0x" + Buffer.from(fromMbHash?.hash as any).toString("hex")).toMatch(
      "0xbddd813c634239723171ef3fee98579b94964e3bb1cb3e427262c8c068d52319"
    );
    expect(mb).toMatch("z2DrjgbH33g3bTa7dPaMq1XbVmKH11m2SwxAF6aNzSd5F3j63p4");
  });
});

describe("to Multibase", () => {
  it("basic test blake2b-256", () => {
    const mb = toMultibase(
      "bddd813c634239723171ef3fee98579b94964e3bb1cb3e427262c8c068d52319",
      "blake2b-256"
    );
    expect(mb).toEqual("z2DrjgbH33g3bTa7dPaMq1XbVmKH11m2SwxAF6aNzSd5F3j63p4");
  });

  it("basic test sha2-256", () => {
    const mb = toMultibase(
      bytes.fromHex(
        "9cbc07c3f991725836a3aa2a581ca2029198aa420b9d99bc0e131d9f3e2cbe47"
      ),
      "sha2-256"
    );
    expect(mb).toEqual("zQmYtUc4iTCbbfVSDNKvtQqrfyezPPnFvE33wFmutw9PBBk");
  });

  it("0x prefixed test", () => {
    const mb = toMultibase(
      "0xbddd813c634239723171ef3fee98579b94964e3bb1cb3e427262c8c068d52319",
      "blake2b-256"
    );
    expect(mb).toEqual("z2DrjgbH33g3bTa7dPaMq1XbVmKH11m2SwxAF6aNzSd5F3j63p4");
  });
});

describe("from Multibase", () => {
  it("basic test blake2b-256", () => {
    const fromMb = fromMultibase(
      "z2DrjgbH33g3bTa7dPaMq1XbVmKH11m2SwxAF6aNzSd5F3j63p4"
    );
    const hex = Buffer.from(fromMb?.hash as any).toString("hex");
    expect(hex).toEqual(
      "bddd813c634239723171ef3fee98579b94964e3bb1cb3e427262c8c068d52319"
    );
  });

  it("basic test sha2-256", () => {
    const fromMb = fromMultibase(
      "zQmYtUc4iTCbbfVSDNKvtQqrfyezPPnFvE33wFmutw9PBBk"
    );
    const hex = Buffer.from(fromMb?.hash as any).toString("hex");
    expect(hex).toEqual(
      "9cbc07c3f991725836a3aa2a581ca2029198aa420b9d99bc0e131d9f3e2cbe47"
    );
  });
});
