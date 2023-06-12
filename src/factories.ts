import { hash } from "./utilities/hash";
import type {
  ActivityContentAudio,
  ActivityContentAudioLink,
  ActivityContentHash,
  ActivityContentHashtag,
  ActivityContentImage,
  ActivityContentImageLink,
  ActivityContentLink,
  ActivityContentLocation,
  ActivityContentMention,
  ActivityContentNote,
  ActivityContentProfile,
  ActivityContentVideo,
  ActivityContentVideoLink,
  DSNPUserURI,
} from "./types";

/**
 * createNote() provides a simple factory for generating an ActivityContentNote
 * object.
 * @param content - The text content to include in the note
 * @param published - the Date that the note was claimed to be published
 * @param options - Overrides default fields for the ActivityContentNote
 * @returns An ActivityContentNote object
 */
export const createNote = (
  content: string,
  published: Date,
  options?: Partial<ActivityContentNote>
): ActivityContentNote => ({
  "@context": "https://www.w3.org/ns/activitystreams",
  type: "Note",
  mediaType: "text/plain",
  published: published.toISOString(),
  content,
  ...options,
});

/**
 * createProfile() provides a simple factory for generating an
 * ActivityContentProfile object.
 * @param options - Overrides any default fields for the ActivityContentProfile
 * @returns An ActivityContentProfile object
 */
export const createProfile = (
  options?: Partial<ActivityContentProfile>
): ActivityContentProfile => ({
  "@context": "https://www.w3.org/ns/activitystreams",
  type: "Profile",
  ...options,
});

/**
 * createAudioAttachment() provides a simple factory for generating an
 * ActivityContentAudio object.
 * @param links - An array of ActivityContentAudioLink objects to include
 * @param options - Overrides any default fields for the ActivityContentAudio
 * @returns An ActivityContentAudio object
 */
export const createAudioAttachment = (
  links: Array<ActivityContentAudioLink>,
  options?: Partial<ActivityContentAudio>
): ActivityContentAudio => ({
  type: "Audio",
  url: links,
  ...options,
});

/**
 * createAudioLink() provides a simple factory for generation an
 * ActivityContentAudioLink object for inclusion in an ActivityContentAudio
 * object.
 * @param href      - The URL of the file
 * @param mediaType - The MIME type of the file (see SUPPORTED_AUDIO_MEDIA_TYPES within validation.ts)
 * @param hash      - An ActivityContentHash object to authenticate the file
 * @param options - Overrides any default fields for the ActivityContentAudioLink
 * @returns An ActivityContentAudioLink object
 */
export const createAudioLink = (
  href: string,
  mediaType: string,
  hash: Array<ActivityContentHash>,
  options?: Partial<ActivityContentAudioLink>
): ActivityContentAudioLink => ({
  type: "Link",
  href,
  mediaType,
  hash,
  ...options,
});

/**
 * createImageAttachment() provides a simple factory for generating an
 * ActivityContentImage object.
 * @param links - An array of ActivityContentImageLink objects to include
 * @param options - Overrides any default fields for the ActivityContentImage
 * @returns An ActivityContentImage object
 */
export const createImageAttachment = (
  links: Array<ActivityContentImageLink>,
  options?: Partial<ActivityContentImage>
): ActivityContentImage => ({
  type: "Image",
  url: links,
  ...options,
});

/**
 * createImageLink() provides a simple factory for generation an
 * ActivityContentImageLink object for inclusion in an ActivityContentImage
 * object.
 * @param href      - The URL of the file
 * @param mediaType - The MIME type of the file (see SUPPORTED_IMAGE_MEDIA_TYPES within validation.ts)
 * @param hash      - An ActivityContentHash object to authenticate the file
 * @param options - Overrides any default fields for the ActivityContentImageLink
 * @returns An ActivityContentImageLink object
 */
export const createImageLink = (
  href: string,
  mediaType: string,
  hash: Array<ActivityContentHash>,
  options?: Partial<ActivityContentImageLink>
): ActivityContentImageLink => ({
  type: "Link",
  href,
  mediaType,
  hash,
  ...options,
});

/**
 * createVideoAttachment() provides a simple factory for generating an
 * ActivityContentVideo object.
 * @param links - An array of ActivityContentVideoLink objects to include
 * @param options - Overrides any default fields for the ActivityContentVideo
 * @returns An ActivityContentVideo object
 */
export const createVideoAttachment = (
  links: Array<ActivityContentVideoLink>,
  options?: Partial<ActivityContentVideo>
): ActivityContentVideo => ({
  type: "Video",
  url: links,
  ...options,
});

/**
 * createVideoLink() provides a simple factory for generation an
 * ActivityContentVideoLink object for inclusion in an ActivityContentVideo
 * object.
 * @param href      - The URL of the file
 * @param mediaType - The MIME type of the file (see SUPPORTED_VIDEO_MEDIA_TYPES within validation.ts)
 * @param hash      - An ActivityContentHash object to authenticate the file
 * @param options - Overrides any default fields for the ActivityContentVideoLink
 * @returns An ActivityContentVideoLink object
 */
export const createVideoLink = (
  href: string,
  mediaType: string,
  hash: Array<ActivityContentHash>,
  options?: Partial<ActivityContentVideoLink>
): ActivityContentVideoLink => ({
  type: "Link",
  href,
  mediaType,
  hash,
  ...options,
});

/**
 * createLinkAttachment() provides a simple factory for generating an
 * ActivityContentLink object.
 * @param href - The URL to include in the link
 * @param options - Overrides any default fields for the ActivityContentLink
 * @returns An ActivityContentLink object
 */
export const createLinkAttachment = (
  href: string,
  options?: Partial<ActivityContentLink>
): ActivityContentLink => ({
  type: "Link",
  href,
  ...options,
});

/**
 * createLocation() provides a simple factory for generating an
 * ActivityContentLocation object.
 * @param name - This is the string provided for name of the Location
 * @param options - Overrides any default fields for the ActivityContentLocation
 * @returns An ActivityContentLocation object
 */
export const createLocation = (
  name: string,
  options?: Partial<ActivityContentLocation>
): ActivityContentLocation => ({
  type: "Place",
  name,
  ...options,
});

/**
 * createHashtag() provides a simple factory for generating an
 * ActivityContentHashtag object.
 * @param name - The hashtag value, without "#" character
 * @returns An ActivityContentTag object
 */
export const createHashtag = (name: string): ActivityContentHashtag => ({
  name,
});

/**
 * createMention() provides a simple factory for generating an
 * ActivityContentMention object.
 * @param id - The DSNPUserId of the mention user
 * @param options - Any additional fields for the ActivityContentMention
 * @returns An ActivityContentMention object
 */
export const createMention = (
  id: DSNPUserURI,
  options?: Partial<ActivityContentMention>
): ActivityContentMention => ({
  type: "Mention",
  id,
  ...options,
});

/**
 * createHash() provides a simple factory for generating an ActivityContentHash
 * object. This factory assumes the user intends to use a standard Keccak256
 * hash. To use other authentication algorithms, users should build their own
 * ActivityContentHash objects.
 * @param content - The file content to be hashed
 * @returns An ActivityContentHash containing the keccak256 proof of the content
 */
export const createHash = (content: string): ActivityContentHash => ({
  algorithm: "keccak256",
  value: hash(content),
});
