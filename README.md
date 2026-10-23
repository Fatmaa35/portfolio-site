# Fatma Kaplan | Portföy

Kişisel portföy ve teknoloji bloğu. Netlify üzerinde yayınlanır.

## Klasör yapısı

```
├── index.html, index-en.html   Ana sayfa (TR / EN)
├── maintenance.html            Bakım sayfası
├── blog/                       Blog yazıları (TR / EN)
├── css/                        style.css (ana sayfa), blog.css (blog)
├── js/                         Sayfa script'leri
│   ├── app.js                  Firebase, iletişim formu, ziyaretçi rotası
│   ├── hero-network.js         Ana bölüm 3D ağ animasyonu
│   ├── portfolio-effects.js    Kaydırma efektleri
│   ├── micro-interactions.js   Küçük etkileşimler
│   └── project-modal-*.js      Proje detay pencereleri (TR / EN)
├── assets/images, img/         Görseller
├── firebase/                   Firestore kuralları ve ayarları
├── docs/                       Güvenlik / deploy notları
└── netlify.toml                Güvenlik başlıkları, önbellek, yönlendirmeler
```

Firestore kurallarını yüklemek için: `cd firebase && firebase deploy --only firestore:rules`
