export const products = [
  {
    id: "toast-ease-pro",
    name: "ToastEase Pro",
    price: "Rp 1.425.000",
    image: "/assets/products/toaster.png",
    glb: "/assets/3D/ToastEase%20Pro.glb",
    description: "Start your morning right with the ToastEase Pro. Features wide slots, precision browning controls, and a sleek design that looks great on any kitchen counter."
  },
  {
    id: "playstation-5",
    name: "PlayStation 5",
    price: "Rp 9.799.000",
    image: "/assets/products/PlayStation 5.png",
    glb: "/assets/3D/PlayStation%205.glb",
    description: "Experience lightning-fast loading with an ultra-high-speed SSD, deeper immersion with support for haptic feedback, adaptive triggers, and 3D Audio, and an all-new generation of incredible PlayStation games."
  },
  {
    id: "breezewave-purifier",
    name: "BreezeWave Purifier",
    price: "Rp 1.955.000",
    image: "/assets/products/BreezeWave Purifier.png",
    glb: "/assets/3D/BreezeWave%20Purifier.glb",
    description: "Keep your indoor air fresh and clean with the BreezeWave Purifier. Its advanced HEPA filter captures 99.97% of airborne particles, making it ideal for allergies and pet owners."
  },
  {
    id: "levoit-purifier",
    name: "Levoit Purifier",
    price: "Rp 2.450.000",
    image: "/assets/products/Levoit Purifier.png",
    glb: "/assets/3D/Levoit%20Purifier.glb",
    description: "The Levoit Purifier offers powerful, rapid air cleaning for large rooms. Enjoy smart controls, real-time air quality monitoring, and a whisper-quiet sleep mode."
  },
  {
    id: "nintendo-switch",
    name: "Nintendo Switch",
    price: "Rp 4.499.000",
    image: "/assets/products/Nintendo Switch.png",
    glb: "/assets/3D/Nintendo%20Switch.glb",
    description: "Play your favorite games anywhere, anytime. Nintendo Switch is designed to fit your life, transforming from home console to portable system in a snap."
  },
  {
    id: "toastmaster-x3",
    name: "ToastMaster X3",
    price: "Rp 1.150.000",
    image: "/assets/products/ToastMaster X3.png",
    glb: "/assets/3D/ToastMaster%20X3.glb",
    description: "The classic ToastMaster X3 provides reliable, quick toasting every time. Features an easy-to-clean crumb tray and multiple shade settings for perfect toast."
  },
  {
    id: "coolwave",
    name: "CoolWave",
    price: "Rp 1.850.000",
    image: "/assets/products/CoolWave.png",
    glb: "/assets/3D/CoolWave.glb",
    description: "Beat the heat with the CoolWave portable fan. Offers powerful airflow, adjustable speeds, and a compact design perfect for your desk or bedside table."
  },
  {
    id: "koffie-new-series",
    name: "Koffie New Series",
    price: "Rp 2.100.000",
    image: "/assets/products/Koffie New Series.png",
    glb: "/assets/3D/Koffie%20New%20Series.glb",
    description: "Brew barista-quality coffee at home with the Koffie New Series. Features precise temperature control, programmable brewing, and a premium aesthetic."
  }
];

export function getProductById(id: string) {
  return products.find(p => p.id === id);
}
