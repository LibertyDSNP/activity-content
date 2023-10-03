interface ActivityContentBase {
  "@context": "https://www.w3.org/ns/activitystreams";
  type: string;
  name?: string;
  published?: string;
  location?: ActivityContentLocation;
  tag?: Array<ActivityContentTag> | ActivityContentTag;
}

/**
 * Hexadecimal String
 */
export type HexString = string;

/**
 * DSNPUserURI represents a URI targeting a user following the DSNP
 * [Identifiers](https://spec.dsnp.org/DSNP/Identifiers.html)
 * specification.
 */
export type DSNPUserURI = string;

/**
 * ActivityContentNote represents a post created by the user.
 */
export interface ActivityContentNote extends ActivityContentBase {
  type: "Note";
  mediaType: "text/plain";
  content: string;
  attachment?: Array<ActivityContentAttachment>;
  published: string;
}

/**
 * ActivityContentProfile represents profile data for the posting user.
 */
export interface ActivityContentProfile extends ActivityContentBase {
  type: "Profile";
  summary?: string;
  icon?: Array<ActivityContentImageLink>;
}

/**
 * ActivityContentLocation represents location data associated with an
 * ActivityContentNote or ActivtyContentProfile.
 */
export interface ActivityContentLocation {
  type: "Place";
  name: string;
  accuracy?: number;
  altitude?: number;
  latitude?: number;
  longitude?: number;
  radius?: number;
  units?: string;
}

/**
 * ActivityContentTag is an ActivityContentHashtag, an
 * ActivityContentMention, or an ActivityContentInteraction.
 */
export type ActivityContentTag =
  | ActivityContentMention
  | ActivityContentInteraction
  | ActivityContentHashtag;

/**
 * ActivityContentHashtag represents a hashtag associated with an
 * ActivityContentNote or an ActivityContentProfile.
 */
export interface ActivityContentHashtag {
  name: string;
}

/**
 * ActivityContentMention represents a mention associated with an
 * ActivityContentNote or an ActivityContentProfile.
 */
export interface ActivityContentMention {
  type: "Mention";
  id: DSNPUserURI;
  name?: string;
}

/**
 * ActivityContentInteraction is a DSNP extension enabling a
 * pseudonymous interaction to be included in a Note or Profile.
 */
export interface ActivityContentInteraction {
  type: "Interaction";
  name?: string;
  href: string;
  rel: string;
  nonce: string;
  ticket: VerifiableCredential;
}

export interface VerifiableCredential {
  "@context"?: string;
  type?: Array<string>;
  issuer?: string;
  issuanceDate?: string; //date?
  credentialSchema?: {
    type: string;
    id: string; //url
  };
  credentialSubject?: {
    interactionId: string;
    href: string;
  };
  proof?: {
    type: string;
    verificationMethod: string;
    created: string;
    proofPurpose: "assertionMethod";
    proofValue: string;
  };
}

/**
 * ActivityContentAttachment represents a piece of external content associated
 * with an ActivityContentNote, such as a picture, video, audio clip or website.
 */
export type ActivityContentAttachment =
  | ActivityContentAudio
  | ActivityContentImage
  | ActivityContentVideo
  | ActivityContentLink;

/**
 * ActivityContentAudio represents an audio clip attached to an
 * ActivityContentNote. ActivityContentAudio objects contain an array of
 * ActivityContentAudioLinks with different versions of the same content. For
 * example, a single item of audio content may be available in multiple formats,
 * such as OGG or MP3, which may be included as individual
 * ActivityContentAudioLink objects. The semantic content of each file should
 * always be identical.
 */
export interface ActivityContentAudio {
  type: "Audio";
  url: Array<ActivityContentAudioLink>;
  name?: string;
  duration?: string;
}

/**
 * ActivityContentImage represents an image file attached to an
 * ActivityContentNote. ActivityContentImage objects contain an array of
 * ActivityContentImageLinks with different versions of the same content. For
 * example, a single picture may be available in multiple formats, such as JPEG
 * or PNG, which may be included as individual ActivityContentImageLink
 * objects. The height and width of the included ActivityContentImageLink
 * objects may also vary to provide faster loading on different screen size
 * devices. The semantic content of each file should always be identical.
 */
export interface ActivityContentImage {
  type: "Image";
  url: Array<ActivityContentImageLink>;
  name?: string;
}

/**
 * ActivityContentVideo represents an video file attached to an
 * ActivityContentNote. ActivityContentVideoLink objects contain an array of
 * ActivityContentVideoLinks with different versions of the same content. For
 * example, a single video may be available in multiple formats, such as MPEG
 * or MKV, which may be included as individual ActivityContentVideoLink
 * objects. The height and width of the included ActivityContentVideoLink
 * objects may also vary to provide faster loading on different screen size
 * devices. The semantic content of each file should always be identical.
 */
export interface ActivityContentVideo {
  type: "Video";
  url: Array<ActivityContentVideoLink>;
  name?: string;
  duration?: string;
}

/**
 * ActivityContentLink represents a link attached to an ActivityContentNote.
 * Unlike ActivityContentAudio, ActivityContentImage and ActivityContentVideo
 * objects, link objects may point to dynamic content, such as a news article,
 * which should not be hashed to prove their authenticity.
 */
export interface ActivityContentLink {
  type: "Link";
  href: string;
  name?: string;
}

/**
 * ActivityContentAudioLink represents a specific audio file included in an
 * ActivityContentAudio object.
 */
export interface ActivityContentAudioLink extends ActivityContentLink {
  mediaType: string;
  hash: Array<ActivityContentHash>;
}

/**
 * ActivityContentImageLink represents a specific image file included in an
 * ActivityContentImage object.
 */
export interface ActivityContentImageLink extends ActivityContentLink {
  mediaType: string;
  hash: Array<ActivityContentHash>;
  height?: number;
  width?: number;
}

/**
 * ActivityContentVideoLink represents a specific video file included in an
 * ActivityContentVideo object.
 */
export interface ActivityContentVideoLink extends ActivityContentLink {
  mediaType: string;
  hash: Array<ActivityContentHash>;
  height?: number;
  width?: number;
}

/**
 * ActivityContentHash represents a hash included in the hash field of an
 * ActivityContentAudioLink, ActivityContentImageLink or
 * ActivityContentVideoLink object to prove it's authenticity.
 */
export type ActivityContentHash = string;
