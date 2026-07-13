INSERT IGNORE INTO categories (id, name, description, image_url) VALUES 
(1, 'Archival Paper', 'Premium paper for long-lasting writing', 'https://images.unsplash.com/photo-1586075010633-2442dc3d6307?auto=format&fit=crop&q=80&w=800'),
(2, 'Fine Writing', 'Exceptional fountain pens and ink', 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&q=80&w=800'),
(3, 'Studio Tools', 'Essentials for the modern studio', 'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&q=80&w=800');

INSERT IGNORE INTO products (id, category_id, name, description, price, stock_quantity, rating, image_url) VALUES 
(1, 1, 'The Vellum Series', 'Archival-grade paper bound in premium Japanese linen.', 28.00, 50, 4.9, 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800'),
(2, 2, 'Brass Fountain Pen', 'Hand-polished brass with a fine nib.', 120.00, 15, 4.8, 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=800'),
(3, 1, 'Linen Sketchbook', 'Textured linen cover with heavyweight paper.', 34.00, 30, 4.9, 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&q=80&w=800');
