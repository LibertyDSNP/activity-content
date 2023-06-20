import {
  createNote,
  createProfile,
  createAudioAttachment,
  createAudioLink,
  createImageAttachment,
  createImageLink,
  createVideoAttachment,
  createVideoLink,
  createLinkAttachment,
  createLocation,
  createHashtag,
  createMention,
  createHash,
} from "../factories";

describe("activityPub", () => {
  describe("createNote", () => {
    it("returns an ActivityContentNote with the given parameters", () => {
      const activityContentNote = createNote(
        "Hello World!",
        new Date("2020-01-01T17:30:00.000Z")
      );

      expect(activityContentNote).toMatchObject({
        "@context": "https://www.w3.org/ns/activitystreams",
        type: "Note",
        content: "Hello World!",
        mediaType: "text/plain",
        published: "2020-01-01T17:30:00.000Z",
      });
    });
  });

  describe("createProfile", () => {
    it("returns an ActivityContentProfile with the given parameters", () => {
      const activityContentProfile = createProfile({ name: "🌹🚗" });

      expect(activityContentProfile).toMatchObject({
        "@context": "https://www.w3.org/ns/activitystreams",
        type: "Profile",
        name: "🌹🚗",
      });
    });
  });

  describe("createAudioAttachment", () => {
    it("returns an ActivityContentAudio with the given parameters", () => {
      const activityContentAudio = createAudioAttachment([
        {
          type: "Link",
          href: "https://upload.wikimedia.org/wikipedia/en/0/01/Hound_Dog_%26_intro_%28live-Ed_Sullivan_2%29.ogg",
          mediaType: "audio/ogg",
          hash: ["zQmav1946cWLvdpmxhVhStj8sgrdsgLojJAxisGHrTPhrTF"],
        },
      ]);

      expect(activityContentAudio).toMatchObject({
        type: "Audio",
        url: [
          {
            type: "Link",
            href: "https://upload.wikimedia.org/wikipedia/en/0/01/Hound_Dog_%26_intro_%28live-Ed_Sullivan_2%29.ogg",
            mediaType: "audio/ogg",
            hash: ["zQmav1946cWLvdpmxhVhStj8sgrdsgLojJAxisGHrTPhrTF"],
          },
        ],
      });
    });
  });

  describe("createAudioLink", () => {
    it("returns an ActivityContentAudioLink with the given parameters", () => {
      const activityContentAudioLink = createAudioLink(
        "https://upload.wikimedia.org/wikipedia/en/0/01/Hound_Dog_%26_intro_%28live-Ed_Sullivan_2%29.ogg",
        "audio/ogg",
        ["zQmav1946cWLvdpmxhVhStj8sgrdsgLojJAxisGHrTPhrTF"]
      );

      expect(activityContentAudioLink).toMatchObject({
        type: "Link",
        href: "https://upload.wikimedia.org/wikipedia/en/0/01/Hound_Dog_%26_intro_%28live-Ed_Sullivan_2%29.ogg",
        mediaType: "audio/ogg",
        hash: ["zQmav1946cWLvdpmxhVhStj8sgrdsgLojJAxisGHrTPhrTF"],
      });
    });
  });

  describe("createImageAttachment", () => {
    it("returns an ActivityContentImage with the given parameters", () => {
      const activityContentImage = createImageAttachment([
        {
          type: "Link",
          href: "https://upload.wikimedia.org/wikipedia/commons/b/bb/Canmania_Car_show_-_Wimborne_%289589569829%29.jpg",
          mediaType: "image/jpg",
          hash: ["zQmU3i7yp9gA6FXk3R8QXmPNZFtKt3NFXkEcW7kPQzLiNxy"],
          height: 1564,
          width: 2782,
        },
      ]);

      expect(activityContentImage).toMatchObject({
        type: "Image",
        url: [
          {
            type: "Link",
            href: "https://upload.wikimedia.org/wikipedia/commons/b/bb/Canmania_Car_show_-_Wimborne_%289589569829%29.jpg",
            mediaType: "image/jpg",
            hash: ["zQmU3i7yp9gA6FXk3R8QXmPNZFtKt3NFXkEcW7kPQzLiNxy"],
            height: 1564,
            width: 2782,
          },
        ],
      });
    });
  });

  describe("createImageLink", () => {
    it("returns an ActivityContentImageLink with the given parameters", () => {
      const activityContentImageLink = createImageLink(
        "https://upload.wikimedia.org/wikipedia/commons/b/bb/Canmania_Car_show_-_Wimborne_%289589569829%29.jpg",
        "image/jpg",
        ["zQmU3i7yp9gA6FXk3R8QXmPNZFtKt3NFXkEcW7kPQzLiNxy"]
      );

      expect(activityContentImageLink).toMatchObject({
        type: "Link",
        href: "https://upload.wikimedia.org/wikipedia/commons/b/bb/Canmania_Car_show_-_Wimborne_%289589569829%29.jpg",
        mediaType: "image/jpg",
        hash: ["zQmU3i7yp9gA6FXk3R8QXmPNZFtKt3NFXkEcW7kPQzLiNxy"],
      });
    });
  });

  describe("createLinkAttachment", () => {
    it("returns an ActivityContentLink with the given parameters", () => {
      const activityContentLink = createLinkAttachment("https://dsnp.org");

      expect(activityContentLink).toMatchObject({
        type: "Link",
        href: "https://dsnp.org",
      });
    });
  });

  describe("createVideoAttachment", () => {
    it("returns an ActivityContentVideo with the given parameters", () => {
      const activityContentVideo = createVideoAttachment([
        {
          type: "Link",
          href: "https://upload.wikimedia.org/wikipedia/commons/c/c0/Big_Buck_Bunny_4K.webm",
          mediaType: "video/webm",
          hash: ["zQmfWveGhSnUiM2i1tMTsHjho81q4nincHCg9krhecsoLf7"],
          height: 2250,
          width: 4000,
        },
      ]);

      expect(activityContentVideo).toMatchObject({
        type: "Video",
        url: [
          {
            type: "Link",
            href: "https://upload.wikimedia.org/wikipedia/commons/c/c0/Big_Buck_Bunny_4K.webm",
            mediaType: "video/webm",
            hash: ["zQmfWveGhSnUiM2i1tMTsHjho81q4nincHCg9krhecsoLf7"],
            height: 2250,
            width: 4000,
          },
        ],
      });
    });
  });

  describe("createVideoLink", () => {
    it("returns an ActivityContentVideoLink with the given parameters", () => {
      const activityContentVideoLink = createVideoLink(
        "https://upload.wikimedia.org/wikipedia/commons/c/c0/Big_Buck_Bunny_4K.webm",
        "video/webm",
        ["zQmfWveGhSnUiM2i1tMTsHjho81q4nincHCg9krhecsoLf7"]
      );

      expect(activityContentVideoLink).toMatchObject({
        type: "Link",
        href: "https://upload.wikimedia.org/wikipedia/commons/c/c0/Big_Buck_Bunny_4K.webm",
        mediaType: "video/webm",
        hash: ["zQmfWveGhSnUiM2i1tMTsHjho81q4nincHCg9krhecsoLf7"],
      });
    });
  });

  describe("createLocation", () => {
    it("returns an ActivityContentLocation with the given parameters", () => {
      const activityContentLocation = createLocation("Earth");

      expect(activityContentLocation).toMatchObject({
        type: "Place",
        name: "Earth",
      });
    });
  });

  describe("createHashtag", () => {
    it("returns an ActivityContentHashtag with the given parameters", () => {
      const activityContentTag = createHashtag("YOLO");

      expect(activityContentTag).toMatchObject({
        name: "YOLO",
      });
    });
  });

  describe("createMention", () => {
    it("returns an ActivityContentMention with the given parameters", () => {
      const activityContentMention = createMention("dsnp://1234");

      expect(activityContentMention).toMatchObject({
        type: "Mention",
        id: "dsnp://1234",
      });
    });
  });

  describe("createHash", () => {
    it("returns an ActivityContentHash with the given parameters", async () => {
      const activityContentHash = await createHash("Lorem ipsum");

      expect(activityContentHash).toMatch(
        "z2DrjgbDFcUWoit2XiRSN3AryzYhLgoSZTjUCdYWoUZbiVksbAp"
      );
    });
  });
});
