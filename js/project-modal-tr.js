    document.addEventListener('DOMContentLoaded', () => {
        const projectModal = document.getElementById('project-modal');
        const closeModalBtn = document.getElementById('close-modal-btn');
        const modalBodyContent = document.getElementById('modal-body-content');
        const detailsBtns = document.querySelectorAll('.prj-details-btn');

        const projectContents = {
            'greenedge': `
                <h2>🌱 GreenEdge – Dijital Karbon Emisyonu Yönetimi</h2>
                <p>
                    GreenEdge, “İklim İçin Dijital Dönüşüm Ideathonu” kapsamında geliştirdiğimiz bir ekip projesidir. Bu projede amacımız, dijital sistemlerin oluşturduğu ancak çoğu zaman fark edilmeyen karbon emisyonlarını görünür hale getirmek ve daha sürdürülebilir bir şekilde yönetilmesini sağlamaktır.
                </p>
                <p>
                    Günümüzde kurumlar fiziksel enerji tüketimini ölçebiliyor olsa da; bulut sistemleri, veri işleme süreçleri ve bilgisayarlarda çalışan arka plan işlemlerinin oluşturduğu dijital karbon ayak izi genellikle göz ardı edilmektedir. GreenEdge, tam olarak bu probleme çözüm üretmeyi hedefler.
                </p>

                <h3>💡 Proje Fikri</h3>
                <p>
                    GreenEdge, cihazlarda çalışan yoğun arka plan işlemlerini, elektrik şebekesinin daha temiz (daha düşük karbon yoğunluklu) olduğu zaman dilimlerine otomatik olarak kaydıran bir Edge AI çözümüdür.
                </p>
                <p><strong>Bu sayede:</strong></p>
                <ul>
                    <li>Aynı işlemler daha çevre dostu enerji ile gerçekleştirilir</li>
                    <li>Karbon emisyonu azaltılır</li>
                    <li>Enerji kullanımı optimize edilir</li>
                </ul>

                <h3>⚙️ Nasıl Çalışır?</h3>
                <ul>
                    <li>Elektrik şebekesinin anlık karbon yoğunluğu verilerini analiz eder</li>
                    <li>Cihaz üzerinde çalışan yapay zekâ modeli ile karar verir</li>
                    <li>Yoğun işlemleri “yeşil saatlere” otomatik olarak planlar</li>
                    <li>Kurumlara enerji tüketimi ve karbon tasarrufu hakkında veri sağlar</li>
                </ul>

                <h3>🎯 Projenin Amacı</h3>
                <ul>
                    <li>Dijital karbon emisyonlarını görünür hale getirmek</li>
                    <li>Enerji kullanımını daha verimli yönetmek</li>
                    <li>Kurumların sürdürülebilirlik ve ESG raporlamasına katkı sağlamak</li>
                </ul>

                <h3>👥 Ekip Çalışması</h3>
                <div class="team-list">
                    <span class="team-member">Beyza Ata</span>
                    <span class="team-member">Hakan Bacanak</span>
                    <span class="team-member">Sezin Tarlığ</span>
                    <span class="team-member">Yunus Emre Coşkun</span>
                    <span class="team-member">Fatma Kaplan</span>
                </div>
            `,
            'telco-churn': `
                <h2>📊 Telco Customer Churn Prediction</h2>
                <p>
                    Bu proje, P2P Yapay Zekâ ve Teknoloji Akademisi Veri Bilimi Challenge sürecinde, 3 kişilik ekip olarak geliştirdiğimiz uçtan uca bir veri bilimi çalışmasıdır. Amaç, telekom sektöründe müşteri kaybını (churn) tahmin ederek şirketlerin müşteri tutma stratejilerine katkı sağlamaktır.
                </p>
                <p>
                    Proje kapsamında veri seti üzerinde detaylı analizler (EDA), veri ön işleme ve feature engineering adımları uygulanmış; Logistic Regression, SVM, KNN ve Random Forest gibi farklı makine öğrenmesi modelleri eğitilip karşılaştırılmıştır. Performans değerlendirmeleri sonucunda en başarılı model olarak Random Forest seçilmiştir.
                </p>
                <p>
                    Ayrıca, geliştirilen modelin kullanılabilirliğini artırmak amacıyla kullanıcıların veri girişi yaparak churn tahmini alabileceği API destekli basit bir arayüz oluşturulmuştur.
                </p>
                <p>
                    Bu proje, veri analizi, model geliştirme ve gerçek dünya problemlerine ekip halinde çözüm üretme konularında önemli bir deneyim sunmuştur.
                </p>

                <h3>👥 Ekip</h3>
                <div class="team-list">
                    <span class="team-member">Fatma Kaplan</span>
                    <span class="team-member">Asya Aynur Gers</span>
                    <span class="team-member">Elif Ep</span>
                </div>
            `,
            'yolarkadasim': `
                <h2>🚗 Yoldaki Arkadaşım – Yolculuk Paylaşım Platformu</h2>
                <p>
                    Yoldaki Arkadaşım, sürücüler ile aynı güzergâhta seyahat etmek isteyen yolcuları bir araya getiren web tabanlı bir yolculuk paylaşım platformudur. Platform, kullanıcıların daha ekonomik seyahat etmesini sağlarken, karşılıklı puanlama ve değerlendirme sistemi sayesinde güvenilir bir topluluk yapısı oluşturmayı hedefler.
                </p>
                <p>
                    Proje, modern bir <strong>Single Page Application (SPA)</strong> mimarisi ile geliştirilmiş olup, dinamik bileşen yapısına sahip <strong>Vanilla JavaScript frontend</strong> ve <strong>PHP tabanlı REST API backend</strong> katmanlarından oluşmaktadır.
                </p>

                <h3>👥 Proje Ekibi</h3>
                <div class="team-list">
                    <span class="team-member">Gökdeniz Kılınç</span>
                    <span class="team-member">Aleyna Övez</span>
                    <span class="team-member">Güler Kıray</span>
                    <span class="team-member">Davut Örs</span>
                    <span class="team-member">Sümeyye Köse</span>
                    <span class="team-member">Fatma Kaplan</span>
                </div>

                <h3>🎯 Projede Üstlendiğim Görevler</h3>
                <ul>
                    <li>Sistem gereksinimlerine uygun <strong>veritabanı tasarımının yapılması</strong></li>
                    <li><strong>ER (Entity-Relationship) diyagramlarının oluşturulması</strong> ve ilişkisel modelin kurgulanması</li>
                    <li>MySQL/MariaDB üzerinde <strong>tabloların, alanların ve ilişkilerin (1-N, N-N) belirlenmesi</strong></li>
                    <li>Veritabanı bütünlüğünü sağlamak için <strong>foreign key, cascade yapıları ve kısıtların uygulanması</strong></li>
                    <li>İş kurallarını otomatikleştirmek amacıyla <strong>SQL trigger yapılarının geliştirilmesi</strong></li>
                </ul>

                <h3>⚙️ Kullanılan Teknolojiler</h3>
                <ul>
                    <li><strong>Frontend:</strong> Vanilla JavaScript (SPA mimarisi), CSS, FontAwesome</li>
                    <li><strong>Backend & API:</strong> PHP (REST API, PDO, CORS yapılandırması)</li>
                    <li><strong>Veritabanı:</strong> MySQL / MariaDB</li>
                    <li><strong>Web Server:</strong> Apache (XAMPP)</li>
                    <li><strong>Harita & Görselleştirme:</strong> Leaflet.js, Leaflet Routing Machine, Chart.js</li>
                </ul>
            `,
            'liman-yonetim': `
                <h2>⚓ Akıllı Liman Operasyon Yönetim Sistemi</h2>
                <p>
                    Veritabanı Yönetimi dersi kapsamında geliştirdiğimiz Akıllı Liman Operasyon Yönetim Sistemi projesi, liman operasyonlarının dijitalleştirilmesi ve akıllı veri analitiği ile optimize edilmesini amaçlayan uçtan uca bir full-stack yazılım ürünüdür.
                </p>
                <p>
                    Projenin ilk aşamasında liman operasyonları detaylıca analiz edilerek sistem senaryoları oluşturulmuş, ardından ER (Varlık-İlişki) diyagramı tasarlanmıştır. Veritabanı yapısı 3. Normal Form (3NF) kurallarına uygun olarak normalize edilerek veri tekrarı en aza indirilmiş, veri bütünlüğü ve tutarlılığı en üst düzeye çıkarılmıştır.
                </p>

                <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; border-radius: 1.5rem; border: 1px solid rgba(0, 255, 204, 0.3); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5); margin: 2.5rem 0;">
                    <iframe src="https://drive.google.com/file/d/1_QmNY66cd9ydezlfHKIO2_nbhu6u33-X/preview" title="Liman Yönetim Sistemi proje videosu" sandbox="allow-scripts allow-same-origin" allow="autoplay" referrerpolicy="strict-origin-when-cross-origin" loading="lazy" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;"></iframe>
                </div>

                <h3>💡 Öne Çıkan Özellikler</h3>
                <ul>
                    <li><strong>İnteraktif Türkiye Haritası & Canlı Kapasite Analizi:</strong> Giriş ekranında pulsing neon pinlerle Türkiye aktif limanlar haritası, limanların üzerine gelindiğinde hesaplanan anlık doluluk oranları ve kuş bakışı rıhtım yerleşimi.</li>
                    <li><strong>Yapay Zekâ Destekli Analizler:</strong> Gemini API entegrasyonu ile ETA (Tahmini Varış Zamanı) bazlı gemi önceliklendirme, bozulabilir yüklerin tespiti ve öncelikli tahliyesi, tehlikeli yük risk analizi, demuraj maliyet optimizasyonu ve rıhtım uygunluk kontrolü.</li>
                    <li><strong>Simülasyon Mekanizması:</strong> İnternet veya API erişiminin kesildiği senaryolarda operasyonların aksamadan devam edebilmesi için kural tabanlı yerel simülasyon modülü.</li>
                    <li><strong>Tam Katmanlı Yazılım Mimarisi:</strong> Veritabanı yapısını destekleyen .NET tabanlı backend servisleri, Dapper ORM kullanımı ve React tabanlı modern frontend kullanıcı arayüzü.</li>
                </ul>

                <h3>👥 Ekip Arkadaşlarım</h3>
                <p>
                    Bu projenin başarıyla hayata geçmesinde emeği olan tüm ekip arkadaşlarıma teşekkür ederim:
                </p>
                <div class="team-list">
                    <span class="team-member">Aleyna Övez</span>
                    <span class="team-member">Güler Kıray</span>
                    <span class="team-member">Kadir Değer</span>
                    <span class="team-member">Sümeyye Köse</span>
                </div>

                <h3>⚙️ Kullanılan Teknolojiler</h3>
                <ul>
                    <li><strong>Backend:</strong> ASP.NET Core Web API, Dapper ORM</li>
                    <li><strong>Frontend:</strong> React (Vite), Axios, Vanilla CSS</li>
                    <li><strong>Veritabanı:</strong> Microsoft SQL Server</li>
                    <li><strong>Yapay Zekâ Entegrasyonu:</strong> Google Gemini API</li>
                </ul>
            `
        };

        detailsBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const projectId = btn.getAttribute('data-project');
                const content = projectContents[projectId];
                if (content && projectModal && modalBodyContent) {
                    modalBodyContent.innerHTML = content;
                    projectModal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        function closeModal() {
            if (projectModal) {
                projectModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        }

        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', closeModal);
        }

        if (projectModal) {
            projectModal.addEventListener('click', (e) => {
                if (e.target === projectModal) {
                    closeModal();
                }
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeModal();
            }
        });
    });
