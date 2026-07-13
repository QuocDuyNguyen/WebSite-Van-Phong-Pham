package com.example.demo.config;

import com.example.demo.entity.Category;
import com.example.demo.entity.Product;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Configuration
public class DataSeeder {

    @Bean
    @Transactional
    public CommandLineRunner initProducts(ProductRepository productRepository, CategoryRepository categoryRepository) {
        return args -> {
            if (productRepository.count() < 15) {
                List<Category> categories = categoryRepository.findAll();
                if (categories.isEmpty()) return;

                Category paper = categories.stream().filter(c -> c.getName().contains("Paper")).findFirst().orElse(categories.get(0));
                Category writing = categories.stream().filter(c -> c.getName().contains("Writing")).findFirst().orElse(categories.get(0));
                Category tools = categories.stream().filter(c -> c.getName().contains("Tools")).findFirst().orElse(categories.get(0));

                String[][] newProducts = {
                    {"Japanese Calligraphy Brush", "Handmade natural hair brush with bamboo handle.", "45.00", "35", "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&q=80&w=800", "writing"},
                    {"Ceramic Ink Well", "Minimalist white porcelain ink container for calligraphy.", "32.00", "20", "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=800", "tools"},
                    {"Leather Journal Cover", "Vegetable-tanned full grain leather folio notebook cover.", "85.00", "15", "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800", "paper"},
                    {"Embossed Note Cards", "Box of 24 textured cotton cards with matching envelopes.", "28.00", "50", "https://images.unsplash.com/photo-1586075010633-2442dc3d6307?auto=format&fit=crop&q=80&w=800", "paper"},
                    {"Brass Desk Ruler", "Solid brass 30cm ruler with precision laser engraving.", "40.00", "25", "https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&q=80&w=800", "tools"},
                    {"Glass Dip Pen", "Hand-blown borosilicate spiral glass writing instrument.", "38.00", "30", "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&q=80&w=800", "writing"},
                    {"Studio Pen Stand", "Heavyweight machined aluminum single-pen desktop holder.", "52.00", "18", "https://images.unsplash.com/photo-1518455027359-f3f816b1a22a?auto=format&fit=crop&q=80&w=800", "tools"},
                    {"Linen Envelope Set", "Pack of 50 luxury European woven envelopes.", "22.00", "60", "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&q=80&w=800", "paper"},
                    {"Heavyweight Blotter Paper", "Absorbent protective desk pad sheet for fountain pens.", "15.00", "80", "https://images.unsplash.com/photo-1586075010633-2442dc3d6307?auto=format&fit=crop&q=80&w=800", "paper"},
                    {"Handcrafted Pen Tray", "Solid American walnut grooved desk organizer.", "64.00", "12", "https://images.unsplash.com/photo-1518455027359-f3f816b1a22a?auto=format&fit=crop&q=80&w=800", "tools"},
                    {"Vintage Paper Clips", "Box of 100 solid copper teardrop clips.", "16.00", "100", "https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&q=80&w=800", "tools"},
                    {"Fountain Pen Converter", "Standard international screw-in piston ink refiller.", "12.00", "90", "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=800", "writing"},
                    {"Cedar Wood Pencil Set", "Box of 12 HB graphite pencils coated in matte black.", "20.00", "75", "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&q=80&w=800", "writing"},
                    {"Solid Brass Paperweight", "Polished cylindrical weight for studio drawings and plans.", "48.00", "22", "https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&q=80&w=800", "tools"},
                    {"Artisan Sealing Wax", "Three sticks of burgundy sealing wax with cotton wicks.", "25.00", "45", "https://images.unsplash.com/photo-1518455027359-f3f816b1a22a?auto=format&fit=crop&q=80&w=800", "tools"},
                    {"Fine Grid Notepad", "Dot-grid perforated notepad engineered for fountain inks.", "18.00", "65", "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800", "paper"}
                };

                for (String[] data : newProducts) {
                    Product p = new Product();
                    p.setName(data[0]);
                    p.setDescription(data[1]);
                    p.setPrice(new BigDecimal(data[2]));
                    p.setStockQuantity(Integer.parseInt(data[3]));
                    p.setImageUrl(data[4]);
                    p.setRating(new BigDecimal("4.9"));
                    
                    if (data[5].equals("paper")) p.setCategory(paper);
                    else if (data[5].equals("writing")) p.setCategory(writing);
                    else p.setCategory(tools);

                    productRepository.save(p);
                }
            }
        };
    }
}
