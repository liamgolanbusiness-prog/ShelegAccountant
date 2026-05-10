# ש.ל.ג חשבונאות ומיסים — Website

אתר נחיתה מלא בעברית, RTL, ממוקד נייד, למשרד רואה החשבון של רו״ח ינוקא לבן.

## Stack
- HTML5 סמנטי, JSON-LD (`AccountingService`)
- CSS מודרני (Grid, Container queries-friendly, Glassmorphism, 3D transforms, Reveal-on-scroll)
- JS וניל (Intersection Observer, Snow canvas, Tilt 3D, slider, mailto-form)
- ללא תלות ב-framework

## הפעלה מקומית
פתחו את `index.html` בדפדפן, או העלו לאחסון סטטי (Vercel / Netlify / GitHub Pages).

## להחלפה לפני העלייה
חפשו `TODO` בקבצים והחליפו:
- מספר טלפון בקישור `tel:` ובקישור הוואטסאפ הצף (`https://wa.me/972XXXXXXXXX`)
- כתובת אימייל ב-`mailto:` וב-JSON-LD
- כתובת המשרד בקישורי `socials` (פייסבוק, אינסטגרם, לינקדאין)
- כתובת ה-canonical / og:url

## תכונות
- היירו עוצמתי עם 3D layered cards וכרטיסי זכוכית
- גלילה חלקה, חשיפה הדרגתית של אלמנטים, מונים מונפשים
- שלג חלקיקים על קנבס (`prefers-reduced-motion`-aware)
- ניווט נייד נגיש, סקיפ-לתוכן, כותרות `aria-*`
- WhatsApp צף וכפתור חזרה למעלה
- SEO: מטא, OG, Twitter Cards, JSON-LD, sitemap, robots
