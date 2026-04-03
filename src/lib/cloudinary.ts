import { Cloudinary } from "@cloudinary/url-gen";
import { dpr, format, quality } from "@cloudinary/url-gen/actions/delivery";
import { source } from "@cloudinary/url-gen/actions/overlay";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { Position } from "@cloudinary/url-gen/qualifiers/position";
import { compass } from "@cloudinary/url-gen/qualifiers/gravity";
import { text } from "@cloudinary/url-gen/qualifiers/source";
import { TextStyle } from "@cloudinary/url-gen/qualifiers/textStyle";

import { CLOUDINARY_CLOUD_NAME } from "@/constants";

const cld = new Cloudinary({
  cloud: {
    cloudName: CLOUDINARY_CLOUD_NAME,
  },
});

export const bannerPhoto = (imageCldPubId: string, name: string) => {
  if (!imageCldPubId || !CLOUDINARY_CLOUD_NAME) {
    return "";
  }

  return cld
    .image(imageCldPubId)
    .resize(fill().width(1200).height(297))
    .delivery(format("auto"))
    .delivery(quality("auto"))
    .delivery(dpr("auto"))
    .overlay(
      source(
        text(name, new TextStyle("roboto", 42).fontWeight("bold")).textColor(
          "white"
        )
      ).position(
        new Position().gravity(compass("south_west")).offsetY(0.2).offsetX(0.02)
      )
    )
    .toURL();
};
