export const dugoniCollaborationImage = {
  src: "https://res.cloudinary.com/dhqpqfw6w/image/upload/v1767551710/university-of-the-pacific-dr-njo_pkcbs4.webp",
  srcSet: [
    "https://res.cloudinary.com/dhqpqfw6w/image/upload/c_limit,w_640,f_auto,q_auto/v1767551710/university-of-the-pacific-dr-njo_pkcbs4.webp 640w",
    "https://res.cloudinary.com/dhqpqfw6w/image/upload/c_limit,w_960,f_auto,q_auto/v1767551710/university-of-the-pacific-dr-njo_pkcbs4.webp 960w",
    "https://res.cloudinary.com/dhqpqfw6w/image/upload/c_limit,w_1280,f_auto,q_auto/v1767551710/university-of-the-pacific-dr-njo_pkcbs4.webp 1280w",
    "https://res.cloudinary.com/dhqpqfw6w/image/upload/c_limit,w_1600,f_auto,q_auto/v1767551710/university-of-the-pacific-dr-njo_pkcbs4.webp 1600w",
  ].join(", "),
  sizes: "(max-width: 768px) 100vw, 420px",
  width: 2076,
  height: 2170,
  alt: "Dr. Michael Njo working with the University of the Pacific Arthur A Dugoni School of Dentistry",
  caption: "Working closely with the University of the Pacific Arthur A Dugoni School of Dentistry.",
};

const galleryImageWidths = [640, 960, 1280, 1600];
const galleryImageSizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";

const buildCloudinarySrcSet = (src: string) =>
  galleryImageWidths
    .map(
      (width) =>
        `${src.replace(
          "/image/upload/",
          `/image/upload/c_limit,w_${width},f_auto,q_auto/`,
        )} ${width}w`,
    )
    .join(", ");

const baseNjoLifeGalleryImages = [
  {
    src: "https://res.cloudinary.com/dhqpqfw6w/image/upload/v1770776241/1_uiehhq.jpg",
    alt: "Interviewee thanking Dr. Michael Njo for inspiring insights and mentorship.",
    caption:
      "Thank you for the interview and your inspiring insights. (Showing gratitude with kind gifts from Shuang’s country to Dr. Njo. From admissions interviewee to attendee as a senior at UOP’s IDS program in Sacramento.)",
  },
  {
    src: "https://res.cloudinary.com/dhqpqfw6w/image/upload/v1770776279/3_yt7juv.jpg",
    alt: "From admissions interviewee to UOP IDS senior in Sacramento, showing gratitude to Dr. Njo.",
  },
  {
    src: "https://res.cloudinary.com/dhqpqfw6w/image/upload/v1770776282/2_lxrfhn.jpg",
    alt: "Kind gifts from Shuang's country shared with Dr. Michael Njo in gratitude for his kindness and mentorship.",
  },
  {
    src: "https://res.cloudinary.com/dhqpqfw6w/image/upload/v1770776307/Updated_cskep5.png",
    alt: "Dr. Michael Njo guiding dental professionals and mentoring future leaders.",
    caption: "Dr. Michael Njo in action guiding dental professionals.",
  },
  {
    src: "https://res.cloudinary.com/dhqpqfw6w/image/upload/v1767707725/Leadership-retreat_peohe1.webp",
    alt: "Leadership retreat with Dr. Njo and peers.",
    caption: "Leadership retreat.",
  },
  {
    src: "https://res.cloudinary.com/dhqpqfw6w/image/upload/v1767707725/UOP-board-dinner_vvxbkq.webp",
    alt: "University of the Pacific board dinner with Dr. Njo.",
    caption: "UOP board dinner.",
  },
  {
    src: "https://res.cloudinary.com/dhqpqfw6w/image/upload/v1767707724/IMG_8543_ytkyrw.webp",
    alt: "Dr. Njo with colleagues at a professional gathering.",
  },
  {
    src: "https://res.cloudinary.com/dhqpqfw6w/image/upload/v1767707725/IMG_4931_wcu1du.webp",
    alt: "Dr. Njo with a practice team.",
  },
  {
    src: "https://res.cloudinary.com/dhqpqfw6w/image/upload/v1767707724/IMG_8025_dlnfeh.webp",
    alt: "Dr. Njo at a career event.",
  },
  {
    src: "https://res.cloudinary.com/dhqpqfw6w/image/upload/v1767707724/IMG_9744_guknem.webp",
    alt: "Dr. Njo with community partners.",
  },
  {
    src: "https://res.cloudinary.com/dhqpqfw6w/image/upload/v1767707724/IMG_5389_rwbt6a.webp",
    alt: "Dr. Njo with dental leaders.",
  },
  {
    src: "https://res.cloudinary.com/dhqpqfw6w/image/upload/v1767707724/IMG_6096_akbi25.webp",
    alt: "Dr. Njo with colleagues during a community event.",
  },
  {
    src: "https://res.cloudinary.com/dhqpqfw6w/image/upload/v1767707724/IMG_3288_dew2yn.webp",
    alt: "Dr. Njo with attendees at a leadership gathering.",
  },
  {
    src: "https://res.cloudinary.com/dhqpqfw6w/image/upload/v1767707723/IMG_1327_vaybin.webp",
    alt: "Dr. Njo sharing a moment with peers.",
  },
  {
    src: "https://res.cloudinary.com/dhqpqfw6w/image/upload/v1767707723/IMG_1227_xutdm7.webp",
    alt: "Dr. Njo with a team at a professional gathering.",
  },
  {
    src: "https://res.cloudinary.com/dhqpqfw6w/image/upload/v1767707724/IMG_2574_faaetd.webp",
    alt: "Dr. Njo at a practice transitions gathering.",
  },
  {
    src: "https://res.cloudinary.com/dhqpqfw6w/image/upload/v1767707723/7FB34B36-7A72-4CB3-962F-71281A882374IMG_3673_pirict.webp",
    alt: "Dr. Njo with colleagues during a group session.",
  },
  {
    src: "https://res.cloudinary.com/dhqpqfw6w/image/upload/v1767707723/IMG_0895_j7ujhg.webp",
    alt: "Dr. Njo with partners celebrating a milestone.",
  },
  {
    src: "https://res.cloudinary.com/dhqpqfw6w/image/upload/v1767707723/dugoni-business-club_iij4ls.webp",
    alt: "Dugoni Business Club gathering with Dr. Njo.",
    caption: "Dugoni Business Club.",
  },
  {
    src: "https://res.cloudinary.com/dhqpqfw6w/image/upload/v1767707723/F733685D-6359-4338-B505-FDB3AC9688A2IMG_3701_xkgzsq.webp",
    alt: "Dr. Njo with colleagues at a group celebration.",
  },
  {
    src: "https://res.cloudinary.com/dhqpqfw6w/image/upload/v1767707722/50C5A5CD-D930-4BDD-9919-C1A4231650E2IMG_5210_cmlwzl.webp",
    alt: "Dr. Njo at a leadership event.",
  },
  {
    src: "https://res.cloudinary.com/dhqpqfw6w/image/upload/v1767707722/761F0EB7-69C4-46CA-8561-D76B91D764EEIMG_1013_fskm7x.webp",
    alt: "Dr. Njo with mentors and peers.",
  },
  {
    src: "https://res.cloudinary.com/dhqpqfw6w/image/upload/v1767707722/7E235CA3-59C9-49DB-A168-FA91E5C9409CIMG_3696_gzdlwq.webp",
    alt: "Dr. Njo with a dental team.",
  },
  {
    src: "https://res.cloudinary.com/dhqpqfw6w/image/upload/v1767707722/1E4E5A0B-5848-42F0-A5A4-A0395A1E48EDIMG_2533_nfhjv4.webp",
    alt: "Dr. Njo at a professional networking event.",
  },
  {
    src: "https://res.cloudinary.com/dhqpqfw6w/image/upload/v1767707722/B7354FA7-28CF-4411-8BA8-9599727C5951IMG_3684_rhzd37.webp",
    alt: "Dr. Njo with attendees at a professional gathering.",
  },
  {
    src: "https://res.cloudinary.com/dhqpqfw6w/image/upload/v1767707722/56673A17-EE90-40A6-AD07-E106BA886208image_1_auaolu.webp",
    alt: "Dr. Njo with colleagues and community partners.",
  },
];

export const njoLifeGalleryImages = baseNjoLifeGalleryImages.map((image) => ({
  ...image,
  srcSet: buildCloudinarySrcSet(image.src),
  sizes: galleryImageSizes,
}));
