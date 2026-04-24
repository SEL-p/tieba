'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Save, Info, Image as ImageIcon, Plus, 
  Trash2, FileText, DollarSign, Package, Truck, CheckCircle2 
} from 'lucide-react';
import Link from 'next/link';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import styles from './nouveau.module.css';

export default function NouveauProduit() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState('basic');
  
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    price: '',
    originalPrice: '',
    minOrder: '1 Pièce/Pièces',
    location: '',
    description: '',
    inStock: true,
    // Extra B2B fields
    brand: '',
    supplyAbility: '10000 Pièces par Mois',
    leadTime: '7-15 jours',
    packaging: 'Cartons standard d\'exportation',
    unit: 'Pièce/Pièces'
  });

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Assemble the final description with B2B attributes
      const richDescription = `
${formData.brand ? `**Marque :** ${formData.brand}\n` : ''}
${formData.description}

**Capacité d'approvisionnement :** ${formData.supplyAbility}
**Délai de livraison estimé :** ${formData.leadTime}
**Détails d'emballage :** ${formData.packaging}
      `.trim();

      const payload = {
        name: formData.name,
        price: formData.price,
        originalPrice: formData.originalPrice,
        categoryId: formData.categoryId,
        description: richDescription,
        inStock: formData.inStock,
        minOrder: formData.minOrder,
        location: formData.location,
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erreur lors de la création');
      }

      router.push('/vendeur/dashboard');
    } catch (err) {
      setError(err.message);
      // Scroll to top to see error
      window.scrollTo(0, 0);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToSection = (id) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className={styles.pageWrapper}>
      <Header />
      
      {/* Top action bar */}
      <div className={styles.topBar}>
        <div className={`container ${styles.topBarInner}`}>
          <div className={styles.breadcrumbs}>
            <Link href="/vendeur/dashboard" className={styles.backLink}>
              <ArrowLeft size={18} /> Tableau de bord
            </Link>
            <span className={styles.separator}>/</span>
            <span className={styles.current}>Publier un produit B2B</span>
          </div>
          
          <div className={styles.actions}>
            <button className={styles.draftBtn}>Enregistrer le brouillon</button>
            <button className={styles.publishBtn} onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? 'Publication...' : 'Soumettre'}
            </button>
          </div>
        </div>
      </div>

      <div className={`container ${styles.mainLayout}`}>
        
        {/* Left Sidebar Navigation */}
        <aside className={styles.sidebarNav}>
          <div className={styles.navMenu}>
            <button 
              className={`${styles.navItem} ${activeSection === 'basic' ? styles.active : ''}`}
              onClick={(e) => { e.preventDefault(); scrollToSection('basic'); }}
            >
              <FileText size={18} /> Informations de base
            </button>
            <button 
              className={`${styles.navItem} ${activeSection === 'trade' ? styles.active : ''}`}
              onClick={(e) => { e.preventDefault(); scrollToSection('trade'); }}
            >
              <DollarSign size={18} /> Informations commerciales
            </button>
            <button 
              className={`${styles.navItem} ${activeSection === 'logistics' ? styles.active : ''}`}
              onClick={(e) => { e.preventDefault(); scrollToSection('logistics'); }}
            >
              <Truck size={18} /> Logistique & Expédition
            </button>
            <button 
              className={`${styles.navItem} ${activeSection === 'details' ? styles.active : ''}`}
              onClick={(e) => { e.preventDefault(); scrollToSection('details'); }}
            >
              <Package size={18} /> Description & Médias
            </button>
          </div>
          
          <div className={styles.completionBox}>
            <div className={styles.completionHeader}>
              <span>Score de qualité</span>
              <strong>85%</strong>
            </div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: '85%' }}></div>
            </div>
            <p className={styles.completionHint}>Ajoutez plus de détails pour améliorer la visibilité auprès des acheteurs.</p>
          </div>
        </aside>

        {/* Main Form Content */}
        <div className={styles.formContent}>
          {error && <div className={styles.errorAlert}>{error}</div>}
          
          <form id="productForm" onSubmit={handleSubmit}>
            
            {/* Section 1: Basic Info */}
            <div id="basic" className={styles.formSection}>
              <div className={styles.sectionHeader}>
                <h2>Informations de base</h2>
              </div>
              <div className={styles.sectionBody}>
                
                <div className={styles.row}>
                  <div className={styles.labelCol}>
                    <label>Nom du produit <span className={styles.req}>*</span></label>
                  </div>
                  <div className={styles.inputCol}>
                    <input 
                      type="text" 
                      name="name"
                      placeholder="Ex: T-shirt en coton bio pour homme, col rond"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className={styles.input}
                    />
                    <p className={styles.inputHint}>Un nom précis et descriptif aide les acheteurs à vous trouver.</p>
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.labelCol}>
                    <label>Catégorie <span className={styles.req}>*</span></label>
                  </div>
                  <div className={styles.inputCol}>
                    <select 
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleChange}
                      required
                      className={styles.select}
                    >
                      <option value="">-- Sélectionnez la catégorie correspondante --</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.labelCol}>
                    <label>Marque</label>
                  </div>
                  <div className={styles.inputCol}>
                    <input 
                      type="text" 
                      name="brand"
                      placeholder="Marque ou fabricant"
                      value={formData.brand}
                      onChange={handleChange}
                      className={styles.input}
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* Section 2: Trade Information */}
            <div id="trade" className={styles.formSection}>
              <div className={styles.sectionHeader}>
                <h2>Informations commerciales</h2>
              </div>
              <div className={styles.sectionBody}>
                
                <div className={styles.b2bNotice}>
                  <Info size={18} />
                  <span>Configurez vos prix de gros (FOB) et les quantités minimales (MOQ) pour attirer les acheteurs B2B.</span>
                </div>

                <div className={styles.row}>
                  <div className={styles.labelCol}>
                    <label>Unité de mesure</label>
                  </div>
                  <div className={styles.inputCol}>
                    <select name="unit" value={formData.unit} onChange={handleChange} className={styles.selectShort}>
                      <option value="Pièce/Pièces">Pièce/Pièces</option>
                      <option value="Carton/Cartons">Carton/Cartons</option>
                      <option value="Tonne/Tonnes">Tonne/Tonnes</option>
                      <option value="Kg/Kgs">Kg/Kgs</option>
                      <option value="Mètre/Mètres">Mètre/Mètres</option>
                      <option value="Set/Sets">Set/Sets</option>
                    </select>
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.labelCol}>
                    <label>Prix FOB (FCFA) <span className={styles.req}>*</span></label>
                  </div>
                  <div className={styles.inputCol}>
                    <div className={styles.priceGroup}>
                      <div className={styles.priceInputWrapper}>
                        <span className={styles.currencyPrefix}>CFA</span>
                        <input 
                          type="number" 
                          name="price"
                          placeholder="Prix unitaire"
                          value={formData.price}
                          onChange={handleChange}
                          required
                          className={styles.inputWithPrefix}
                        />
                      </div>
                      <span className={styles.priceSep}>/ {formData.unit.split('/')[0]}</span>
                    </div>
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.labelCol}>
                    <label>Prix catalogue barré</label>
                  </div>
                  <div className={styles.inputCol}>
                    <div className={styles.priceGroup}>
                      <div className={styles.priceInputWrapper}>
                        <span className={styles.currencyPrefix}>CFA</span>
                        <input 
                          type="number" 
                          name="originalPrice"
                          placeholder="Prix public"
                          value={formData.originalPrice}
                          onChange={handleChange}
                          className={styles.inputWithPrefix}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.labelCol}>
                    <label>Commande min. (MOQ) <span className={styles.req}>*</span></label>
                  </div>
                  <div className={styles.inputCol}>
                    <input 
                      type="text" 
                      name="minOrder"
                      placeholder={`Ex: 100 ${formData.unit}`}
                      value={formData.minOrder}
                      onChange={handleChange}
                      required
                      className={styles.inputShort}
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* Section 3: Logistics */}
            <div id="logistics" className={styles.formSection}>
              <div className={styles.sectionHeader}>
                <h2>Logistique & Expédition</h2>
              </div>
              <div className={styles.sectionBody}>

                <div className={styles.row}>
                  <div className={styles.labelCol}>
                    <label>Lieu d'expédition</label>
                  </div>
                  <div className={styles.inputCol}>
                    <input 
                      type="text" 
                      name="location"
                      placeholder="Ex: Port d'Abidjan / Bouaké"
                      value={formData.location}
                      onChange={handleChange}
                      className={styles.input}
                    />
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.labelCol}>
                    <label>Capacité d'approvisionnement</label>
                  </div>
                  <div className={styles.inputCol}>
                    <input 
                      type="text" 
                      name="supplyAbility"
                      placeholder="Ex: 50000 Tonnes par Mois"
                      value={formData.supplyAbility}
                      onChange={handleChange}
                      className={styles.input}
                    />
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.labelCol}>
                    <label>Délai de livraison estimé</label>
                  </div>
                  <div className={styles.inputCol}>
                    <input 
                      type="text" 
                      name="leadTime"
                      placeholder="Ex: 15-30 jours selon quantité"
                      value={formData.leadTime}
                      onChange={handleChange}
                      className={styles.input}
                    />
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.labelCol}>
                    <label>Détails d'emballage</label>
                  </div>
                  <div className={styles.inputCol}>
                    <textarea 
                      name="packaging"
                      placeholder="Décrivez comment le produit est emballé..."
                      value={formData.packaging}
                      onChange={handleChange}
                      className={styles.textareaShort}
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* Section 4: Details & Media */}
            <div id="details" className={styles.formSection}>
              <div className={styles.sectionHeader}>
                <h2>Description & Médias</h2>
              </div>
              <div className={styles.sectionBody}>

                <div className={styles.row}>
                  <div className={styles.labelCol}>
                    <label>Images du produit <span className={styles.req}>*</span></label>
                  </div>
                  <div className={styles.inputCol}>
                    <div className={styles.mediaGrid}>
                      <div className={styles.mediaUploadBoxMain}>
                        <ImageIcon size={32} />
                        <span>Image Principale</span>
                      </div>
                      <div className={styles.mediaUploadBox}>
                        <Plus size={24} />
                      </div>
                      <div className={styles.mediaUploadBox}>
                        <Plus size={24} />
                      </div>
                      <div className={styles.mediaUploadBox}>
                        <Plus size={24} />
                      </div>
                    </div>
                    <p className={styles.inputHint}>Format JPG, PNG. Max 5MB par image. La première image est l'image principale.</p>
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.labelCol}>
                    <label>Description détaillée <span className={styles.req}>*</span></label>
                  </div>
                  <div className={styles.inputCol}>
                    {/* Fake rich text toolbar */}
                    <div className={styles.richTextEditor}>
                      <div className={styles.editorToolbar}>
                        <button type="button"><strong>B</strong></button>
                        <button type="button"><em>I</em></button>
                        <button type="button"><u>U</u></button>
                        <span className={styles.toolbarSep}></span>
                        <button type="button">List</button>
                      </div>
                      <textarea 
                        name="description"
                        placeholder="Présentez les spécifications, l'utilisation, et les avantages de votre produit..."
                        value={formData.description}
                        onChange={handleChange}
                        required
                        className={styles.editorTextarea}
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <div className={styles.formFooter}>
              <label className={styles.termsCheckbox}>
                <input type="checkbox" required />
                <span>J'accepte les conditions de publication de Tieba Market et je certifie que les informations sont exactes.</span>
              </label>
              
              <div className={styles.bottomActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => router.push('/vendeur/dashboard')}>
                  Annuler
                </button>
                <button type="submit" className={styles.submitBtnLarge} disabled={isLoading}>
                  {isLoading ? 'Publication en cours...' : 'Publier le produit B2B'}
                </button>
              </div>
            </div>

          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
