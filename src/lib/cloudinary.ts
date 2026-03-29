import { CLOUDINARY_CLOUD_NAME } from "@/constants";

export const bannerPhoto = (imageCldPubId: string, name: string) => {
  if (!imageCldPubId || !CLOUDINARY_CLOUD_NAME) {
    return "";
  }

  const encodedName = encodeURIComponent(name);

  return [
    "https://res.cloudinary.com",
    CLOUDINARY_CLOUD_NAME,
    "image/upload",
    "c_fill,w_1200,h_297,f_auto,q_auto,dpr_auto",
    `l_text:roboto_42_bold:${encodedName},co_white,g_south_west,x_20,y_20`,
    imageCldPubId,
  ].join("/");
};
