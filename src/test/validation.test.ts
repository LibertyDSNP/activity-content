import { jest } from "@jest/globals";
import {
  ActivityContentAttachment,
  ActivityContentNote,
  ActivityContentProfile,
} from "../types";
import {
  isActivityContentProfileType,
  isActivityContentNoteType,
  requireIsActivityContentNoteType,
  requireIsActivityContentProfileType,
  requireValidActivityContentNote,
  requireValidActivityContentProfile,
  requireGetSupportedContentAttachments,
} from "../validation";

describe("activity content validations", () => {
  const consoleError = console.error;
  beforeEach(() => {
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = consoleError;
  });
  describe("isActivityContentProfileType", () => {
    it("returns true for a valid Profile", () => {
      const validProfile = {
        "@context": "https://www.w3.org/ns/activitystreams",
        type: "Profile",
        name: "jaboukie",
        attachment: [
          {
            type: "Image",
            url: [
              {
                type: "Link",
                href: "https://upload.wikimedia.org/wikipedia/commons/a/ae/Mccourt.jpg",
                mediaType: "image/jpeg",
                hash: ["zQmReZ1EGMTHNdB1izF1cUH3nYZ1htiyQpHQUPws9rRFHpE"],
              },
            ],
          },
        ],
      };

      expect(isActivityContentProfileType(validProfile)).toEqual(true);
    });
    it("returns false for an invalid Profile", () => {
      const invalidProfile = {
        "@context": "https://www.w3.org/ns/activitystreams",
        type: "Profile",
        name: "jaboukie",
        attachment: [
          {
            type: "Image",
            url: [
              {
                type: "Link",
                href: "https://upload.wikimedia.org/wikipedia/commons/a/ae/Mccourt.jpg",
                mediaType: "image/jpeg",
                hash: "this should be an array",
              },
            ],
          },
        ],
      };
      expect(isActivityContentNoteType(invalidProfile)).toEqual(false);
    });
  });
  describe("isActivityContentNoteType", () => {
    it("returns true for a valid Note", () => {
      const validNote = {
        "@context": "https://www.w3.org/ns/activitystreams",
        type: "Note",
        content: "Hello world!",
        mediaType: "text/plain",
        published: "2000-01-01T00:00:00.000+00:00",
      };
      expect(isActivityContentNoteType(validNote)).toEqual(true);
    });
    it("returns false for an invalid Note: mediaType", () => {
      const invalidNote = {
        "@context": "https://www.w3.org/ns/activitystreams",
        type: "Note",
        content: "I am invalid because I am missing a mediaType",
        published: "2000-01-01T00:00:00.000+00:00",
      };
      expect(isActivityContentNoteType(invalidNote)).toEqual(false);
    });
    it("returns false for an invalid Note: published", () => {
      const invalidNote = {
        "@context": "https://www.w3.org/ns/activitystreams",
        type: "Note",
        mediaType: "text/plain",
        content: "I am invalid because I am missing a published",
      };
      expect(isActivityContentNoteType(invalidNote)).toEqual(false);
    });
  });
  describe("requireGetSupportedContentAttachments", () => {
    describe("when there is one valid attachment", () => {
      const testCases: Record<string, Array<ActivityContentAttachment>> = {
        "Image attachment with multiple urls and only one is valid": [
          {
            type: "Image",
            url: [
              {
                type: "Link",
                href: "https://upload.wikimedia.org/wikipedia/commons/a/ae/Mccourt.jpg",
                mediaType: "image/jpeg",
                hash: ["zQmReZ1EGMTHNdB1izF1cUH3nYZ1htiyQpHQUPws9rRFHpE"],
              },
              {
                type: "Link",
                href: "https://upload.wikimedia.org/wikipedia/commons/a/ae/Mccourt.jpg",
                mediaType: "image/foo",
                hash: ["zQmReZ1EGMTHNdB1izF1cUH3nYZ1htiyQpHQUPws9rRFHpE"],
              },
            ],
          },
        ],
        "Video attachment with multiple hashes but only one is a valid hash algorithm":
          [
            {
              type: "Video",
              name: "My video",
              duration: "PT1H26M39S",
              url: [
                {
                  type: "Link",
                  href: "https://upload.wikimedia.org/wikipedia/commons/c/c0/Big_Buck_Bunny_4K.webm",
                  mediaType: "video/webm",
                  hash: [
                    "zQmfWveGhSnUiM2i1tMTsHjho81q4nincHCg9krhecsoLf7",
                    "zPmfWveGhSnUiM2i1tMTsHjho81q4nincHCg9krhecsoLf7",
                  ],
                },
              ],
            },
          ],
        "with a link attachment": [
          {
            type: "Link",
            href: "https://dsnp.org",
          },
        ],
        "with an audio attachment": [
          {
            type: "Audio",
            url: [
              {
                type: "Link",
                href: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Wilhelm_Scream.ogg",
                mediaType: "audio/ogg",
                hash: ["zQmRyTFRtrv13YFS7TftT5kFXyFcbb95rCuBJTErngrCBgv"],
              },
            ],
          },
        ],
        "an Image attachment with multiple URLs, and only one is valid (but all pass the type checks)":
          [
            {
              type: "Image",
              url: [
                {
                  type: "Link",
                  href: "https://upload.wikimedia.org/wikipedia/commons/a/ae/Mccourt.jpg",
                  mediaType: "badMediaType",
                  hash: ["zQmReZ1EGMTHNdB1izF1cUH3nYZ1htiyQpHQUPws9rRFHpE"],
                },
                {
                  type: "Link",
                  name: "this is fine",
                  href: "https://upload.wikimedia.org/wikipedia/commons/a/ae/Mccourt.jpg",
                  mediaType: "image/jpeg",
                  hash: ["zQmReZ1EGMTHNdB1izF1cUH3nYZ1htiyQpHQUPws9rRFHpE"],
                },
              ],
            },
          ],
      };
      for (const tc in testCases) {
        it(`returns the attachment ${tc}`, () => {
          expect(
            requireGetSupportedContentAttachments(testCases[tc])
          ).toStrictEqual(testCases[tc]);
        });
      }
    });
    describe("when there is one invalid attachment", () => {
      [
        {
          name: "a Video attachment with multiple URLs and one fails a type check (with a malformed hash)",
          expErr:
            "Activity Content Error: Invalid ActivityContent: ActivityContent hash algorithms must contain valid multihash with a supported algorithm",
          attachment: [
            {
              name: "Multiple URLs with one having a malformed hash",
              type: "Video",
              duration: "PT3M2S",
              url: [
                {
                  type: "Link",
                  href: "https://upload.wikimedia.org/wikipedia/commons/a/ae/Mccourt.jpg",
                  mediaType: "video/mpeg",
                  hash: ["zQmReZ1EGMTHNdB1izF1cUH3nYZ1htiyQpHQUPws9rRFHpE"],
                },
                {
                  type: "Link",
                  href: "https://upload.wikimedia.org/wikipedia/commons/a/ae/Mccourt.jpg",
                  mediaType: "video/webm",
                  hash: ["BAD"],
                },
              ],
            },
          ],
        },
        {
          name: "an audio attachment with a bad duration value",
          expErr: "ActivityContentAudio duration is invalid",
          attachment: [
            {
              name: "I have a name",
              duration: "53 minutes",
              type: "Audio",
              url: [
                {
                  type: "Link",
                  href: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Wilhelm_Scream.ogg",
                  mediaType: "audio/ogg",
                  hash: ["zQmRyTFRtrv13YFS7TftT5kFXyFcbb95rCuBJTErngrCBgv"],
                },
              ],
            },
          ],
        },
        {
          name: "an image attachment with a bad name value",
          expErr: "ActivityContentImage name is not a string",
          attachment: [
            {
              type: "Image",
              name: 1234,
              url: [
                {
                  type: "Link",
                  href: "https://upload.wikimedia.org/wikipedia/commons/a/ae/Mccourt.jpg",
                  mediaType: "image/jpeg",
                  hash: ["zQmReZ1EGMTHNdB1izF1cUH3nYZ1htiyQpHQUPws9rRFHpE"],
                },
              ],
            },
          ],
        },
        {
          name: "a video attachment with an unsupported mediaType",
          expErr: "ActivityContentVideo has no supported media types",
          attachment: [
            {
              type: "Video",
              url: [
                {
                  type: "Link",
                  href: "https://upload.wikimedia.org/wikipedia/commons/c/c0/Big_Buck_Bunny_4K.webm",
                  mediaType: "video/avi",
                  hash: ["zQmfWveGhSnUiM2i1tMTsHjho81q4nincHCg9krhecsoLf7"],
                },
              ],
            },
          ],
        },
        {
          name: "a link attachment with an invalid protocol",
          expErr: "ActivityContentLink href is invalid",
          attachment: [
            {
              type: "Link",
              href: "ftp://dsnp.org",
            },
          ],
        },
        {
          name: "audio attachment with an unsupported algorithm",
          expErr:
            "ActivityContent hash algorithms must contain valid multihash with a supported algorithm",
          attachment: [
            {
              type: "Audio",
              url: [
                {
                  type: "Link",
                  href: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Wilhelm_Scream.ogg",
                  mediaType: "audio/ogg",
                  hash: ["zPmRyTFRtrv13YFS7TftT5kFXyFcbb95rCuBJTErngrCBgv"],
                },
              ],
            },
          ],
        },
        {
          name: "audio attachment with undefined hash",
          expErr: "ActivityContentAudioLink hash is invalid",
          attachment: [
            {
              type: "Audio",
              url: [
                {
                  type: "Link",
                  href: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Wilhelm_Scream.ogg",
                  mediaType: "audio/ogg",
                },
              ],
            },
          ],
        },
        {
          name: "audio attachment with bad hash",
          expErr:
            "ActivityContent hash algorithms must contain valid multihash with a supported algorithm",
          attachment: [
            {
              type: "Audio",
              url: [
                {
                  type: "Link",
                  href: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Wilhelm_Scream.ogg",
                  mediaType: "audio/ogg",
                  hash: [
                    "0x360097c9715f55abcc26ab73f12f69b730c660fbf019fc63caa685bfa9b6585b",
                  ],
                },
              ],
            },
          ],
        },
        {
          name: "a link attachment with no type",
          expErr: "ActivityContentAttachment type is invalid",
          attachment: [
            {
              href: "https://dsnp.org",
            },
          ],
        },
        {
          name: "an Image attachment with only invalid URLs, throws on first encountered error",
          expErr:
            "Activity Content Error: Invalid ActivityContent: ActivityContentImageLink mediaType is not a string",
          attachment: [
            {
              type: "Image",
              url: [
                {
                  type: "Link",
                  href: "https://upload.wikimedia.org/wikipedia/commons/a/ae/Mccourt.jpg",
                  hash: ["zQmReZ1EGMTHNdB1izF1cUH3nYZ1htiyQpHQUPws9rRFHpE"],
                },
                {
                  type: "Link",
                  href: "https://upload.wikimedia.org/wikipedia/commons/a/ae/Mccourt.jpg",
                  hash: ["zQmReZ1EGMTHNdB1izF1cUH3nYZ1htiyQpHQUPws9rRFHpE"],
                },
              ],
            },
          ],
        },
      ].forEach((testCase) => {
        it(`${testCase.name} throws expected error`, () => {
          expect(() =>
            requireGetSupportedContentAttachments(testCase.attachment)
          ).toThrow(testCase.expErr);
        });
      });
    });
    describe("when there are multiple attachments, and one is invalid by failing type check", () => {
      it("will match the valid one only", () => {
        const validAttachment = {
          type: "Video",
          url: [
            {
              type: "Link",
              href: "https://upload.wikimedia.org/wikipedia/commons/c/c0/Big_Buck_Bunny_4K.webm",
              mediaType: "video/webm",
              hash: ["zQmfWveGhSnUiM2i1tMTsHjho81q4nincHCg9krhecsoLf7"],
            },
          ],
        };
        const typeCheckFailingAttachment = {
          type: "Video",
          url: [
            {
              type: "Link",
              href: "https://upload.wikimedia.org/wikipedia/commons/c/c0/Happy_Rabbits_On_Farm_4K.webm",
              mediaType: "video/webm",
              hash: ["zPmfWveGhSnUiM2i1tMTsHjho81q4nincHCg9krhecsoLf7"],
            },
          ],
        };
        expect(
          requireGetSupportedContentAttachments([
            validAttachment,
            typeCheckFailingAttachment,
          ])
        ).toStrictEqual([validAttachment]);
      });
      it("with two Image attachments but only one is valid, returns the valid one", () => {
        const validAttachment = {
          type: "Image",
          url: [
            {
              type: "Link",
              href: "https://upload.wikimedia.org/wikipedia/commons/a/ae/Mccourt.jpg",
              mediaType: "image/jpeg",
              hash: ["zQmReZ1EGMTHNdB1izF1cUH3nYZ1htiyQpHQUPws9rRFHpE"],
            },
          ],
        };
        const invalidAttachment = {
          type: "Image",
          url: [
            {
              type: "Link",
              href: "https://upload.wikimedia.org/wikipedia/commons/a/ae/Mccourt.jpg",
              hash: ["zQmReZ1EGMTHNdB1izF1cUH3nYZ1htiyQpHQUPws9rRFHpE"],
            },
          ],
        };

        expect(
          requireGetSupportedContentAttachments([
            validAttachment,
            invalidAttachment,
          ])
        ).toStrictEqual([validAttachment]);
      });

      it("with two Link attachments where one is invalid, returns only the valid attachment", () => {
        const validAttachment = {
          type: "Link",
          href: "https://dsnp.org",
        };
        const invalidAttachment = {
          type: "Link",
          href: "ftp://dsnp.org",
        };
        expect(
          requireGetSupportedContentAttachments([
            validAttachment,
            invalidAttachment,
          ])
        ).toHaveLength(1);
      });
      it("with multiple valid attachments of different types, returns all attachments", () => {
        const validImageAttachment = {
          type: "Image",
          url: [
            {
              type: "Link",
              href: "https://upload.wikimedia.org/wikipedia/commons/a/ae/Mccourt.jpg",
              mediaType: "image/jpeg",
              hash: ["zQmReZ1EGMTHNdB1izF1cUH3nYZ1htiyQpHQUPws9rRFHpE"],
            },
          ],
        };
        const validLinkAttachment = {
          type: "Link",
          href: "https://dsnp.org",
        };
        const validVideoAttachment = {
          type: "Video",
          url: [
            {
              type: "Link",
              href: "https://upload.wikimedia.org/wikipedia/commons/c/c0/Big_Buck_Bunny_4K.webm",
              mediaType: "video/webm",
              hash: ["zQmfWveGhSnUiM2i1tMTsHjho81q4nincHCg9krhecsoLf7", "BAD"],
            },
          ],
        };

        expect(
          requireGetSupportedContentAttachments([
            validLinkAttachment,
            validImageAttachment,
            validVideoAttachment,
          ])
        ).toHaveLength(3);
      });
    });
  });
  describe("requireActivityContentNoteType", () => {
    describe("when a Note's types are valid", () => {
      const activityContentNotes: Record<string, ActivityContentNote> = {
        "with no attachments": {
          "@context": "https://www.w3.org/ns/activitystreams",
          type: "Note",
          content: "Hello world!",
          mediaType: "text/plain",
          published: "2000-01-01T00:00:00.000+00:00",
        },
        "with no attachments and no content": {
          "@context": "https://www.w3.org/ns/activitystreams",
          type: "Note",
          content: "",
          mediaType: "text/plain",
          published: "2000-01-01T00:00:00.000+00:00",
        },
        "with a hashtag": {
          "@context": "https://www.w3.org/ns/activitystreams",
          type: "Note",
          content: "Hello world!",
          mediaType: "text/plain",
          published: "2000-01-01T00:00:00.000+00:00",
          tag: [{ name: "happiness" }, { name: "feels" }, { name: "kawaii" }],
        },
        "with a mention": {
          "@context": "https://www.w3.org/ns/activitystreams",
          type: "Note",
          content: "Hello world!",
          mediaType: "text/plain",
          published: "2000-01-01T00:00:00.000+00:00",
          tag: [
            { type: "Mention", id: "dsnp://1001", name: "Spoopy" },
            { type: "Mention", id: "dsnp://1002", name: "Snoopy" },
          ],
        },
        "with an audio attachment": {
          "@context": "https://www.w3.org/ns/activitystreams",
          type: "Note",
          content: "Feel like I've heard this before!",
          mediaType: "text/plain",
          published: "2000-01-01T00:00:00.000+00:00",
          attachment: [
            {
              type: "Audio",
              url: [
                {
                  type: "Link",
                  href: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Wilhelm_Scream.ogg",
                  mediaType: "audio/ogg",
                  hash: ["zQmRyTFRtrv13YFS7TftT5kFXyFcbb95rCuBJTErngrCBgv"],
                },
              ],
            },
          ],
        },
        "with an image attachment": {
          "@context": "https://www.w3.org/ns/activitystreams",
          type: "Note",
          content: "Interesting guy!",
          mediaType: "text/plain",
          published: "2000-01-01T00:00:00.000+00:00",
          attachment: [
            {
              type: "Image",
              url: [
                {
                  type: "Link",
                  href: "https://upload.wikimedia.org/wikipedia/commons/a/ae/Mccourt.jpg",
                  mediaType: "image/jpeg",
                  hash: ["zQmReZ1EGMTHNdB1izF1cUH3nYZ1htiyQpHQUPws9rRFHpE"],
                },
              ],
            },
          ],
        },
        "with a video attachment": {
          "@context": "https://www.w3.org/ns/activitystreams",
          type: "Note",
          content: "What an adventure!",
          mediaType: "text/plain",
          published: "2000-01-01T00:00:00.000+00:00",
          attachment: [
            {
              type: "Video",
              url: [
                {
                  type: "Link",
                  href: "https://upload.wikimedia.org/wikipedia/commons/c/c0/Big_Buck_Bunny_4K.webm",
                  mediaType: "video/webm",
                  hash: ["zQmfWveGhSnUiM2i1tMTsHjho81q4nincHCg9krhecsoLf7"],
                },
              ],
            },
          ],
        },
        "with a video attachment that has one supported media type and one not":
          {
            "@context": "https://www.w3.org/ns/activitystreams",
            type: "Note",
            content: "What an adventure!",
            mediaType: "text/plain",
            published: "2000-01-01T00:00:00.000+00:00",
            attachment: [
              {
                type: "Video",
                url: [
                  {
                    type: "Link",
                    href: "https://upload.wikimedia.org/wikipedia/commons/c/c0/Big_Buck_Bunny_4K.webm",
                    mediaType: "video/webm",
                    hash: ["zQmfWveGhSnUiM2i1tMTsHjho81q4nincHCg9krhecsoLf7"],
                  },
                  {
                    type: "Link",
                    href: "https://upload.wikimedia.org/wikipedia/commons/c/c0/AWindowsMediaVideo.wmv",
                    mediaType: "video/wmv",
                    hash: [
                      "2Drjgb4a8eC4XheBKCBcbAcaVdEWcKjMbCSZ2L2c9CQs4x98jf",
                    ],
                  },
                ],
              },
            ],
          },
        "with a link attachment": {
          "@context": "https://www.w3.org/ns/activitystreams",
          type: "Note",
          content: "Interesting project!",
          mediaType: "text/plain",
          published: "2000-01-01T00:00:00.000+00:00",
          attachment: [
            {
              type: "Link",
              href: "https://dsnp.org",
            },
          ],
        },
        "with a location": {
          "@context": "https://www.w3.org/ns/activitystreams",
          type: "Note",
          content: "Hello world!",
          mediaType: "text/plain",
          published: "2000-01-01T00:00:00.000+00:00",
          location: {
            type: "Place",
            name: "Topkapi Palace, Istanbul, Turkey",
            accuracy: 10,
            altitude: 51,
            latitude: 41.0115195,
            longitude: 28.9811849,
            radius: 100,
            units: "m",
          },
        },
      };

      for (const key in activityContentNotes) {
        it(`returns true for ${key}`, () => {
          expect(() =>
            requireIsActivityContentNoteType(activityContentNotes[key])
          ).not.toThrow();
        });
      }
    });
    describe("when a Note fails type checks because of", () => {
      [
        {
          name: "a missing mediaType",
          testObject: {
            "@context": "https://www.w3.org/ns/activitystreams",
            type: "Note",
            content: "Hello world!",
          },
          expErr: "invalid ActivityContentNote mediaType",
        },
        {
          name: "an invalid location type",
          expErr: "ActivityContentNote location is not a record type",
          testObject: {
            "@context": "https://www.w3.org/ns/activitystreams",
            type: "Note",
            content: "Hello world!",
            mediaType: "text/plain",
            location: "My house",
          },
        },
        {
          name: "a valid profile object",
          expErr: "invalid ActivityContentNote type",
          testObject: {
            "@context": "https://www.w3.org/ns/activitystreams",
            type: "Profile",
            name: "🌹🚗",
          },
        },
      ].forEach((testCase) => {
        it(`${testCase.name} throws correct error`, () => {
          expect(() =>
            requireIsActivityContentNoteType(testCase.testObject)
          ).toThrow("Invalid ActivityContent: " + testCase.expErr);
        });
      });
    });
  });

  describe("requireIsActivityContentProfile", () => {
    describe("when the profile is valid", () => {
      const activityContentProfiles: Record<string, ActivityContentProfile> = {
        "a profile object": {
          "@context": "https://www.w3.org/ns/activitystreams",
          type: "Profile",
          name: "🌹🚗",
        },
        "a profile object with a published timestamp": {
          "@context": "https://www.w3.org/ns/activitystreams",
          type: "Profile",
          name: "jaboukie",
          published: "2000-01-01T00:00:00.000+00:00",
        },
        "a profile object with icon": {
          "@context": "https://www.w3.org/ns/activitystreams",
          type: "Profile",
          name: "dril",
          icon: [
            {
              type: "Link",
              href: "https://pbs.twimg.com/profile_images/847818629840228354/VXyQHfn0_400x400.jpg",
              mediaType: "image/jpeg",
              hash: ["zQmYtUc4iTCbbfVSDNKvtQqrfyezPPnFvE33wFmutw9PBBk"],
            },
          ],
        },
      };

      for (const key in activityContentProfiles) {
        it(`returns true for ${key}`, () => {
          expect(
            requireIsActivityContentProfileType(activityContentProfiles[key])
          ).toEqual(true);
        });
      }
    });
    describe("when the profile is invalid", () => {
      [
        {
          name: "when the name is invalid",
          expErr: "ActivityContentProfile name is not a string",
          testObject: {
            name: 1234,
            "@context": "https://www.w3.org/ns/activitystreams",
            type: "Profile",
            content: "Feel like I've heard this before!",
          },
        },
        {
          name: "when the context is invalid",
          expErr: "invalid ActivityContentProfile @context",
          testObject: {
            "@context": "https://www.w3.org/ns/activitystreamzzz",
            type: "Profile",
            content: "Me",
          },
        },
        {
          name: "icon has invalid hash value",
          expErr: "ActivityContentImageLink hash is invalid",
          testObject: {
            "@context": "https://www.w3.org/ns/activitystreams",
            type: "Profile",
            content: "Feel like I've heard this before!",
            icon: [
              {
                type: "Link",
                href: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Wilhelm_Scream.jpg",
                mediaType: "image/jpeg",
                hash: [{ bad: "value" }],
              },
            ],
          },
        },
        {
          name: "icon is missing a mediaType",
          expErr: "ActivityContentImageLink mediaType is not a string",
          testObject: {
            "@context": "https://www.w3.org/ns/activitystreams",
            type: "Profile",
            content: "Interesting guy!",
            icon: [
              {
                type: "Link",
                href: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Wilhelm_Scream.jpg",
                hash: ["zQmRyTFRtrv13YFS7TftT5kFXyFcbb95rCuBJTErngrCBgv"],
              },
            ],
          },
        },
        {
          name: "a profile undefined type field",
          expErr: "invalid ActivityContentProfile type",
          testObject: {
            "@context": "https://www.w3.org/ns/activitystreams",
            name: "🌹🚗",
          },
        },
        {
          name: "a profile with a bad type field",
          expErr: "invalid ActivityContentProfile type",
          testObject: {
            type: "Profil",
            "@context": "https://www.w3.org/ns/activitystreams",
            name: "🌹🚗",
          },
        },
        {
          name: "a profile with bad summary",
          expErr: "ActivityContentProfile summary is not a string",
          testObject: {
            type: "Profile",
            "@context": "https://www.w3.org/ns/activitystreams",
            name: "🌹🚗",
            summary: 12345,
          },
        },
        {
          name: "a profile with icon without a hash",
          expErr: "ActivityContentImageLink hash is invalid",
          testObject: {
            "@context": "https://www.w3.org/ns/activitystreams",
            type: "Profile",
            name: "dril",
            icon: [
              {
                type: "Link",
                mediaType: "image/jpeg",
                href: "https://pbs.twimg.com/profile_images/847818629840228354/VXyQHfn0_400x400.jpg",
              },
            ],
          },
        },
        {
          name: "a profile with bad icon",
          expErr: "ActivityContentProfile icon is invalid",
          testObject: {
            "@context": "https://www.w3.org/ns/activitystreams",
            type: "Profile",
            name: "dril",
            icon: "http://placekitten.com/700/400",
          },
        },
        {
          name: "a valid note type",
          expErr: "invalid ActivityContentProfile type",
          testObject: {
            "@context": "https://www.w3.org/ns/activitystreams",
            type: "Note",
            content: "Hello world!",
            mediaType: "text/plain",
          },
        },
      ].forEach((testCase) => {
        it(`throws error for ${testCase.name}`, () => {
          expect(() =>
            requireIsActivityContentProfileType(testCase.testObject)
          ).toThrow(
            "Activity Content Error: Invalid ActivityContent: " +
              testCase.expErr
          );
        });
      });
    });
  });
  describe("requireValidActivityContentNote", () => {
    describe("when the Note is valid", () => {
      const validActivityContentNotes: Record<string, ActivityContentNote> = {
        "a note with no attachments": {
          "@context": "https://www.w3.org/ns/activitystreams",
          type: "Note",
          content: "Hello world!",
          mediaType: "text/plain",
          published: "2000-01-01T00:00:00.000+00:00",
        },
        "a note with an audio attachment": {
          "@context": "https://www.w3.org/ns/activitystreams",
          type: "Note",
          content: "Feel like I've heard this before!",
          mediaType: "text/plain",
          published: "2000-01-01T00:00:00.000+00:00",
          attachment: [
            {
              type: "Audio",
              url: [
                {
                  type: "Link",
                  href: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Wilhelm_Scream.ogg",
                  mediaType: "audio/ogg",
                  hash: ["zQmRyTFRtrv13YFS7TftT5kFXyFcbb95rCuBJTErngrCBgv"],
                },
              ],
            },
          ],
        },
        "a note with an image attachment": {
          "@context": "https://www.w3.org/ns/activitystreams",
          type: "Note",
          content: "Interesting guy!",
          mediaType: "text/plain",
          published: "2000-01-01T00:00:00.000+00:00",
          attachment: [
            {
              type: "Image",
              url: [
                {
                  type: "Link",
                  href: "https://upload.wikimedia.org/wikipedia/commons/a/ae/Mccourt.jpg",
                  mediaType: "image/jpeg",
                  hash: ["zQmReZ1EGMTHNdB1izF1cUH3nYZ1htiyQpHQUPws9rRFHpE"],
                },
              ],
            },
          ],
        },
        "a note with a video attachment": {
          "@context": "https://www.w3.org/ns/activitystreams",
          type: "Note",
          content: "What an adventure!",
          mediaType: "text/plain",
          published: "2000-01-01T00:00:00.000+00:00",
          attachment: [
            {
              type: "Video",
              url: [
                {
                  type: "Link",
                  href: "https://upload.wikimedia.org/wikipedia/commons/c/c0/Big_Buck_Bunny_4K.webm",
                  mediaType: "video/webm",
                  hash: ["zQmfWveGhSnUiM2i1tMTsHjho81q4nincHCg9krhecsoLf7"],
                },
              ],
            },
          ],
        },
        "a note with a link attachment": {
          "@context": "https://www.w3.org/ns/activitystreams",
          type: "Note",
          content: "Interesting project!",
          mediaType: "text/plain",
          published: "2000-01-01T00:00:00.000+00:00",
          attachment: [
            {
              type: "Link",
              href: "https://dsnp.org",
            },
          ],
        },
        "a note with multiple attachments": {
          "@context": "https://www.w3.org/ns/activitystreams",
          type: "Note",
          content: "Interesting project!",
          mediaType: "text/plain",
          published: "2000-01-01T00:00:00.000+00:00",
          attachment: [
            {
              type: "Link",
              href: "https://dsnp.org",
            },
            {
              type: "Link",
              href: "https://placekitten.com",
            },
            {
              type: "Link",
              href: "https://examplecompany.com",
            },
          ],
        },
        "a note with a location": {
          "@context": "https://www.w3.org/ns/activitystreams",
          type: "Note",
          content: "Interesting project!",
          mediaType: "text/plain",
          published: "2000-01-01T00:00:00.000+00:00",
          location: { type: "Place", name: "Valjevo, Serbia" },
        },
      };

      for (const key in validActivityContentNotes) {
        it(`Does not throw for ${key}`, () => {
          expect(() =>
            requireValidActivityContentNote(validActivityContentNotes[key])
          ).not.toThrow();
        });
      }
    });

    describe("when the Note is invalid", () => {
      [
        {
          name: "a note with a bad published 'value' field",
          expErr: "ActivityContentNote published is invalid",
          note: {
            published: "Yesterday",
            "@context": "https://www.w3.org/ns/activitystreams",
            type: "Note",
            content: "Hello world!",
            mediaType: "text/plain",
            hash: ["2Drjgb4a8eC4XheBKCBcbAcaVdEWcKjMbCSZ2L2c9CQs4x98jf"],
          },
        },
        {
          name: "with a location that is not a record",
          expErr: "ActivityContentNote location is not a record type",
          note: {
            location: "bad",
            "@context": "https://www.w3.org/ns/activitystreams",
            type: "Note",
            content: "Interesting project!",
            mediaType: "text/plain",
            published: "2000-01-01T00:00:00.000+00:00",
          },
        },
        {
          name: "with a location object that is not a valid Location Type",
          expErr: "ActivityContentLocation type is not 'Place'",
          note: {
            location: {
              type: "bad",
              name: "This is fine",
            },
            "@context": "https://www.w3.org/ns/activitystreams",
            type: "Note",
            content: "Interesting project!",
            mediaType: "text/plain",
            published: "2000-01-01T00:00:00.000+00:00",
          },
        },
        {
          name: "with a note object that is not a valid published",
          expErr: "ActivityContentNote published is not a string",
          note: {
            "@context": "https://www.w3.org/ns/activitystreams",
            type: "Note",
            content: "Interesting project!",
            mediaType: "text/plain",
          },
        },
      ].forEach((testCase) => {
        it(`throws an error for ${testCase.name}`, () => {
          expect(() => requireValidActivityContentNote(testCase.note)).toThrow(
            "Activity Content Error: Invalid ActivityContent: " +
              testCase.expErr
          );
        });
      });
    });
  });
  describe("requireValidActivityContentProfile", () => {
    describe("when profile is valid", () => {
      const validActivityContentProfiles: Record<
        string,
        ActivityContentProfile
      > = {
        "a profile object": {
          "@context": "https://www.w3.org/ns/activitystreams",
          type: "Profile",
          name: "🌹🚗",
        },
        "a profile object with a published timestamp": {
          "@context": "https://www.w3.org/ns/activitystreams",
          type: "Profile",
          name: "jaboukie",
          published: "2000-01-01T00:00:00+00:00",
        },
        "a profile object with a location": {
          "@context": "https://www.w3.org/ns/activitystreams",
          type: "Profile",
          name: "jaboukie",
          location: {
            type: "Place",
            name: "My house",
            accuracy: 1,
            altitude: 1,
            latitude: 1,
            longitude: 1,
            radius: 1,
            units: "string",
          },
        },
        "a profile object with icon": {
          "@context": "https://www.w3.org/ns/activitystreams",
          type: "Profile",
          name: "dril",
          icon: [
            {
              type: "Link",
              href: "https://pbs.twimg.com/profile_images/847818629840228354/VXyQHfn0_400x400.jpg",
              mediaType: "image/jpeg",
              hash: ["zQmYtUc4iTCbbfVSDNKvtQqrfyezPPnFvE33wFmutw9PBBk"],
            },
          ],
        },
      };
      for (const key in validActivityContentProfiles) {
        it(`returns true for ${key}`, () => {
          expect(() =>
            requireValidActivityContentProfile(
              validActivityContentProfiles[key]
            )
          ).not.toThrow();
        });
      }
    });

    describe("when profile is invalid", () => {
      [
        {
          name: "when location has the wrong type",
          expErr: "ActivityContentLocation type is not 'Place'",
          testObject: {
            "@context": "https://www.w3.org/ns/activitystreams",
            type: "Profile",
            content: "Me",
            location: {
              type: "bad",
              name: "This is fine",
            },
          },
        },
        {
          name: "when a single tag is invalid",
          expErr: "ActivityContentHashtag name is not a string",
          testObject: {
            "@context": "https://www.w3.org/ns/activitystreams",
            type: "Profile",
            content: "Me",
            tag: { hashtag: "spoopy" },
          },
        },
        {
          name: "when a mention tag is invalid",
          expErr: "ActivityContentMention id is not a valid DSNPUserURI",
          testObject: {
            "@context": "https://www.w3.org/ns/activitystreams",
            type: "Profile",
            content: "Me",
            tag: [{ type: "Mention", id: "badwolf", name: "spoopy" }],
          },
        },
        {
          name: "with an invalid published timestamp",
          expErr: "ActivityContentProfile published is invalid",
          testObject: {
            "@context": "https://www.w3.org/ns/activitystreams",
            type: "Profile",
            name: "jaboukie",
            published: "07/28/2021",
          },
        },
        {
          name: "with an icon with an invalid hash",
          expErr:
            "ActivityContent hash algorithms must contain valid multihash with a supported algorithm",
          testObject: {
            "@context": "https://www.w3.org/ns/activitystreams",
            type: "Profile",
            name: "dril",
            icon: [
              {
                type: "Link",
                mediaType: "image/jpeg",
                href: "https://pbs.twimg.com/profile_images/847818629840228354/VXyQHfn0_400x400.jpg",
                hash: ["2Drjgb4a8eC4XheBKCBcbAcaVdEWcKjMbCSZ2L2c9CQs4x98jf"],
              },
            ],
          },
        },
        {
          name: "with an icon with an unsupported hash algorithm",
          expErr:
            "ActivityContent hash algorithms must contain valid multihash with a supported algorithm",
          testObject: {
            "@context": "https://www.w3.org/ns/activitystreams",
            type: "Profile",
            name: "dril",
            icon: [
              {
                type: "Link",
                mediaType: "image/jpeg",
                href: "https://pbs.twimg.com/profile_images/847818629840228354/VXyQHfn0_400x400.jpg",
                hash: ["zPmYtUc4iTCbbfVSDNKvtQqrfyezPPnFvE33wFmutw9PBBk=="],
              },
            ],
          },
        },
        {
          name: "with an icon with an unsupported protocol link",
          expErr: "ActivityContentLink href is invalid",
          testObject: {
            "@context": "https://www.w3.org/ns/activitystreams",
            type: "Profile",
            name: "dril",
            icon: [
              {
                type: "Link",
                mediaType: "image/jpeg",
                href: "ftp://pbs.twimg.com/profile_images/847818629840228354/VXyQHfn0_400x400.jpg",
                hash: ["zQmYtUc4iTCbbfVSDNKvtQqrfyezPPnFvE33wFmutw9PBBk"],
              },
            ],
          },
        },
        {
          name: "with a location missing a type",
          expErr: "ActivityContentLocation type is not 'Place'",
          testObject: {
            "@context": "https://www.w3.org/ns/activitystreams",
            type: "Profile",
            name: "jaboukie",
            location: { name: "My house", units: "m" },
          },
        },
        {
          name: "with a location with bad numbers",
          expErr: "ActivityContentLocation latitude is not a number",
          testObject: {
            "@context": "https://www.w3.org/ns/activitystreams",
            type: "Profile",
            name: "jaboukie",
            location: { type: "Place", name: "My house", latitude: "string" },
          },
        },
      ].forEach((testCase) => {
        it(`throws error for ${testCase.name}`, () => {
          expect(() =>
            requireValidActivityContentProfile(testCase.testObject)
          ).toThrow(
            "Activity Content Error: Invalid ActivityContent: " +
              testCase.expErr
          );
        });
      });
    });
  });
});
