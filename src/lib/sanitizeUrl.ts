export const sanitizeUrl = (url: string | undefined): string => {
  // taken from https://github.com/angular/angular/blob/master/packages/core/src/sanitization/url_sanitizer.ts

  const SAFE_URL_PATTERN = /^(?:(?:https?|mailto|ftp|tel|file|sms):|[^&:/?#]*(?:[/?#]|$))/gi;

  /** A pattern that matches safe data URLs. Only matches image, video and audio types. */
  // eslint-disable-next-line no-useless-escape
  const DATA_URL_PATTERN =
    /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[a-z0-9+/]+=*$/i;

  const urlString = String(url);
  if (urlString.match(SAFE_URL_PATTERN) || urlString.match(DATA_URL_PATTERN)) return urlString;

  return "unsafe:" + urlString;
};
