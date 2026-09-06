import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Printer, Download, Package, ArrowLeft, MapPin, Phone, Mail, Globe, FileText, User as UserIcon, Truck, CheckCircle2, FileCheck2, Lock, ShieldCheck, CheckSquare, Shield, CheckCircle, CreditCard, QrCode } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { SEO } from '../components/SEO';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

interface OrderItem {
  name: string;
  price: number;
  image: string;
  sku?: string;
  discount?: number;
  description?: string;
}

interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
  items: OrderItem[];
}

const Invoice: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, registeredUsers } = useAuthStore();
  const dbUser = registeredUsers.find(u => u.uid === user?.uid);
  const [order, setOrder] = useState<Order | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (location.state && location.state.order) {
      // Mock some additional data for the new layout
      const enrichedOrder = {
        ...location.state.order,
        items: location.state.order.items.map((item: any, i: number) => ({
          ...item,
          sku: `PST-TH-${204 + i}`,
          discount: i === 0 ? 20.00 : 0, // Mock discount on first item
          description: item.name === 'Smart Thermostat' ? 'Wi-Fi Enabled Thermostat' : 'Premium electronic device'
        }))
      };
      setOrder(enrichedOrder);
    } else {
      navigate('/profile', { state: { tab: 'orders' } });
    }
  }, [location, navigate]);

  if (!order || !user) return <div className="p-8 text-center">Loading invoice...</div>;

  const subtotal = order.items.reduce((acc, item) => acc + item.price, 0);
  const totalDiscount = order.items.reduce((acc, item) => acc + (item.discount || 0), 0);
  const taxableAmount = subtotal - totalDiscount;
  const taxRate = 0.08;
  const tax = taxableAmount * taxRate;
  const shipping = 15.00;
  const grandTotal = taxableAmount + tax + shipping;

  const invoiceNo = order.id.replace('ORD-', 'INV-');
  const transactionId = `TXN_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) return;
    try {
      setIsGeneratingPDF(true);
      const element = invoiceRef.current;
      
      const imgData = await toPng(element, {
        pixelRatio: 2,
        cacheBust: true,
      });
      
      const elWidth = element.offsetWidth;
      const elHeight = element.offsetHeight;
      
      const pdfWidth = 210; // A4 width in mm
      const pdfHeight = (elHeight * pdfWidth) / elWidth;
      
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: [pdfWidth, pdfHeight]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`invoice_${order.id}.pdf`);
    } catch (error: any) {
      console.error('Error generating PDF:', error);
      alert(`There was a problem generating your PDF: ${error.message || error}. Please try again or use the Print option.`);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-2 sm:px-8 print:p-0 print:bg-white text-[13px] text-gray-700 font-sans leading-relaxed">
      <SEO title={`Invoice ${order.id}`} description={`Invoice details for order ${order.id}`} />
      
      <div className="max-w-[900px] mx-auto">
        {/* Action Bar (Hidden on Print) */}
        <div className="mb-6 flex justify-between items-center print:hidden">
          <button 
            onClick={() => navigate('/profile', { state: { tab: 'orders' } })} 
            className="flex items-center gap-2 text-gray-600 hover:text-sapphire transition-colors font-medium text-sm"
          >
            <ArrowLeft size={18} /> Back to Orders
          </button>
          <div className="flex gap-3">
            <button onClick={handlePrint} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-50 shadow-sm transition-colors text-sm">
              <Printer size={18} /> Print
            </button>
            <button 
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className={`flex items-center gap-2 px-5 py-2.5 text-white rounded-lg font-bold shadow-sm transition-colors text-sm ${isGeneratingPDF ? 'bg-[#0B409C]/70 cursor-not-allowed' : 'bg-[#0B409C] hover:bg-blue-900'}`}
            >
              <Download size={18} /> 
              {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
            </button>
          </div>
        </div>

        {/* Invoice Document */}
        <div ref={invoiceRef} className="bg-white shadow-2xl overflow-hidden print:shadow-none print:w-[210mm] print:h-[297mm] mx-auto relative border border-gray-200 print:border-none">
          
          <div className="p-10 pb-0">
            {/* Header Section */}
            <div className="flex justify-between items-start mb-8">
              {/* Left Company Info */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-[#0B409C] rounded-lg flex items-center justify-center text-white">
                    <Package size={26} className="stroke-[2.5]" />
                  </div>
                  <span className="text-3xl font-black tracking-tight text-[#0B409C] flex items-center gap-2">THE <img src="/logo.svg" alt="Bat Logo" className="h-6 w-auto object-contain" /> STORE</span>
                </div>
                
                <h2 className="text-[#0B409C] font-bold text-base mb-3">The BatStore Inc.</h2>
                
                <div className="space-y-2 text-gray-600 text-[13px]">
                  <div className="flex items-start gap-2">
                    <MapPin size={15} className="mt-0.5 text-gray-400" />
                    <div>
                      <p>123 Commerce Blvd, Suite 400</p>
                      <p>San Francisco, CA 94105, USA</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={15} className="text-gray-400" />
                    <p>+1 (415) 555-0189</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={15} className="text-gray-400" />
                    <p>support@thebatstore.com</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe size={15} className="text-gray-400" />
                    <p>www.thebatstore.com</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText size={15} className="text-gray-400" />
                    <p>Tax ID: US-TX-8945721</p>
                  </div>
                </div>
              </div>
              
              {/* Right Invoice Info */}
              <div className="w-[320px]">
                <h1 className="text-5xl font-black text-[#0B409C] mb-6 text-right uppercase tracking-tight">Invoice</h1>
                
                <div className="grid grid-cols-[110px_10px_1fr] gap-y-2.5 text-[13px]">
                  <div className="font-bold text-gray-900">Invoice No.</div>
                  <div className="text-center">:</div>
                  <div className="text-gray-700">{invoiceNo}</div>
                  
                  <div className="font-bold text-gray-900">Order No.</div>
                  <div className="text-center">:</div>
                  <div className="text-gray-700">{order.id}</div>
                  
                  <div className="font-bold text-gray-900">Invoice Date</div>
                  <div className="text-center">:</div>
                  <div className="text-gray-700">{order.date}</div>
                  
                  <div className="font-bold text-gray-900">Due Date</div>
                  <div className="text-center">:</div>
                  <div className="text-gray-700">{order.date}</div>
                  
                  <div className="font-bold text-gray-900">Payment Method</div>
                  <div className="text-center">:</div>
                  <div className="text-gray-700">Visa •••• 4582</div>
                  
                  <div className="font-bold text-gray-900">Currency</div>
                  <div className="text-center">:</div>
                  <div className="text-gray-700">USD</div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px w-full bg-gray-200 mb-6"></div>

            {/* 3 Column Cards */}
            <div className="grid grid-cols-3 gap-5 mb-8">
              
              {/* Billed To */}
              <div className="bg-[#F8FAFC] border border-blue-100 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4 text-[#0B409C]">
                  <div className="bg-[#0B409C] text-white p-1.5 rounded-lg"><UserIcon size={16} /></div>
                  <span className="font-bold uppercase tracking-wider text-sm">Billed To</span>
                </div>
                <h3 className="font-black text-gray-900 text-base mb-1">{dbUser?.displayName || user.displayName || 'Customer'}</h3>
                <p className="text-gray-600 mb-4">{user.email}</p>
                
                <div className="grid grid-cols-[100px_10px_1fr] gap-y-2 mb-4 text-[12px]">
                  <div className="font-bold text-gray-900">Customer ID</div>
                  <div className="text-center">:</div>
                  <div className="text-gray-700">{dbUser?.uid || 'CUS-109823'}</div>
                  
                  <div className="font-bold text-gray-900">Phone</div>
                  <div className="text-center">:</div>
                  <div className="text-gray-700">{dbUser?.phone || '+1 555-901-2233'}</div>
                </div>
                
                <div>
                  <div className="font-bold text-gray-900 text-[12px] mb-1">Billing Address:</div>
                  {dbUser?.billingAddress?.street ? (
                    <div className="text-gray-600 text-[12px]">
                      <p>{dbUser.billingAddress.street}</p>
                      <p>{dbUser.billingAddress.city}, {dbUser.billingAddress.state} {dbUser.billingAddress.zip}</p>
                    </div>
                  ) : (
                    <div className="text-gray-600 text-[12px]">
                      <p>Wayne Manor</p>
                      <p>1007 Mountain Drive</p>
                      <p>Gotham City, USA</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4 text-emerald-600">
                  <div className="bg-emerald-500 text-white p-1.5 rounded-lg"><MapPin size={16} /></div>
                  <span className="font-bold uppercase tracking-wider text-sm">Shipping Address</span>
                </div>
                <h3 className="font-black text-gray-900 text-base mb-1">{dbUser?.displayName || user.displayName || 'Customer'}</h3>
                
                {dbUser?.shippingAddress?.street ? (
                  <div className="text-gray-600 text-[12px] mb-4 h-[60px]">
                    <p>{dbUser.shippingAddress.street}</p>
                    <p>{dbUser.shippingAddress.city}, {dbUser.shippingAddress.state} {dbUser.shippingAddress.zip}</p>
                  </div>
                ) : (
                  <div className="text-gray-600 text-[12px] mb-4 h-[60px]">
                    <p>Wayne Manor</p>
                    <p>1007 Mountain Drive</p>
                    <p>Gotham City, USA</p>
                  </div>
                )}
                
                <div className="border-t border-dashed border-gray-200 pt-3 mt-3 grid grid-cols-[100px_10px_1fr] gap-y-2 text-[12px]">
                  <div className="font-bold text-gray-900">Shipping Method</div>
                  <div className="text-center">:</div>
                  <div className="text-gray-700">Express Delivery</div>
                  
                  <div className="font-bold text-gray-900">Tracking Number</div>
                  <div className="text-center">:</div>
                  <div className="text-gray-700">TRK983724982</div>
                  
                  <div className="font-bold text-gray-900">Estimated Delivery</div>
                  <div className="text-center">:</div>
                  <div className="text-gray-700">Jul 16, 2026</div>
                </div>
              </div>

              {/* Payment Status */}
              <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col">
                <div className="flex items-center gap-2 mb-4 text-emerald-600">
                  <div className="bg-emerald-500 text-white p-1.5 rounded-full"><CheckCircle2 size={16} /></div>
                  <span className="font-bold uppercase tracking-wider text-sm">Payment Status</span>
                </div>
                
                <h2 className="text-2xl font-black text-emerald-600 mb-4 tracking-tight">PAID IN FULL</h2>
                
                <div className="grid grid-cols-[90px_10px_1fr] gap-y-2 mb-auto text-[12px]">
                  <div className="font-bold text-gray-900">Paid On</div>
                  <div className="text-center">:</div>
                  <div className="text-gray-700">{order.date}</div>
                  
                  <div className="font-bold text-gray-900">Transaction ID</div>
                  <div className="text-center">:</div>
                  <div className="text-gray-700 uppercase">{transactionId}</div>
                </div>
                
                <div className="mt-4 bg-emerald-50 border border-emerald-100 rounded-lg p-3 flex gap-2">
                  <CheckCircle size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-emerald-700 text-[11px] leading-tight">Thank you! Your payment has been successfully processed.</p>
                </div>
              </div>

            </div>

            {/* Table */}
            <div className="mb-6 rounded-lg overflow-hidden border border-gray-200">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#0B409C] text-white text-[11px] uppercase tracking-wider font-bold">
                  <tr>
                    <th className="py-3 px-4 text-center w-12">#</th>
                    <th className="py-3 px-4">Item Description</th>
                    <th className="py-3 px-4 text-center">SKU</th>
                    <th className="py-3 px-4 text-center">Qty</th>
                    <th className="py-3 px-4 text-right">Unit Price</th>
                    <th className="py-3 px-4 text-right">Discount</th>
                    <th className="py-3 px-4 text-right">Tax (8%)</th>
                    <th className="py-3 px-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {order.items.map((item, idx) => {
                    const itemTax = (item.price - (item.discount || 0)) * taxRate;
                    const itemTotal = item.price - (item.discount || 0) + itemTax;
                    
                    return (
                      <tr key={idx} className="bg-white">
                        <td className="py-4 px-4 text-center text-gray-500">{idx + 1}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <img src={`${item.image}${item.image.includes('?') ? '&' : '?'}cors=1`} alt={item.name} crossOrigin="anonymous" className="w-10 h-10 rounded-md object-cover border border-gray-100 shrink-0" />
                            <div>
                              <p className="font-bold text-gray-900">{item.name}</p>
                              <p className="text-gray-500 text-[11px] mt-0.5">{item.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center text-gray-600 text-[12px]">{item.sku}</td>
                        <td className="py-4 px-4 text-center text-gray-900">1</td>
                        <td className="py-4 px-4 text-right text-gray-600">${item.price.toFixed(2)}</td>
                        <td className="py-4 px-4 text-right text-red-500 font-medium">
                          {item.discount ? `-$${item.discount.toFixed(2)}` : '-'}
                        </td>
                        <td className="py-4 px-4 text-right text-gray-600">${itemTax.toFixed(2)}</td>
                        <td className="py-4 px-4 text-right font-bold text-gray-900">${itemTotal.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Totals Section */}
            <div className="flex justify-end mb-8 border-b border-gray-100 pb-8">
              <div className="w-[380px]">
                <div className="space-y-3 px-4 mb-4">
                  <div className="flex justify-between text-[13px]">
                    <span className="text-gray-600 font-bold">Subtotal</span>
                    <span className="text-gray-900 font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[13px]">
                    <span className="text-gray-600 font-bold">Discount</span>
                    <span className="text-red-500 font-medium">-${totalDiscount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[13px]">
                    <span className="text-gray-600 font-bold">Shipping</span>
                    <span className="text-gray-900 font-medium">${shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[13px]">
                    <span className="text-gray-600 font-bold">Tax (8%)</span>
                    <span className="text-gray-900 font-medium">${tax.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="bg-[#EEF4FF] border border-blue-100 rounded-lg p-4 flex justify-between items-center">
                  <span className="font-black text-gray-900 uppercase tracking-wider text-sm">Grand Total</span>
                  <span className="font-black text-2xl text-[#0B409C]">${grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Bottom 3 Blocks */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              
              {/* Payment Info */}
              <div>
                <div className="flex items-center gap-2 mb-4 text-[#0B409C] border-b border-gray-100 pb-2">
                  <CreditCard size={18} className="stroke-[2]" />
                  <span className="font-bold uppercase tracking-wider text-[11px]">Payment Information</span>
                </div>
                <div className="grid grid-cols-[100px_10px_1fr] gap-y-2.5 text-[12px] mb-4">
                  <div className="font-bold text-gray-900">Payment Method</div>
                  <div className="text-center">:</div>
                  <div className="text-gray-700">Visa •••• 4582</div>
                  
                  <div className="font-bold text-gray-900">Paid On</div>
                  <div className="text-center">:</div>
                  <div className="text-gray-700">{order.date}</div>
                  
                  <div className="font-bold text-gray-900">Transaction ID</div>
                  <div className="text-center">:</div>
                  <div className="text-gray-700 uppercase">{transactionId}</div>
                </div>
                <span className="inline-block bg-green-50 text-green-700 border border-green-100 text-[10px] font-black px-3 py-1.5 rounded uppercase tracking-wider">
                  Paid In Full
                </span>
              </div>
              
              {/* Shipping Info */}
              <div>
                <div className="flex items-center gap-2 mb-4 text-[#0B409C] border-b border-gray-100 pb-2">
                  <Truck size={18} className="stroke-[2]" />
                  <span className="font-bold uppercase tracking-wider text-[11px]">Shipping Information</span>
                </div>
                <div className="grid grid-cols-[100px_10px_1fr] gap-y-2.5 text-[12px]">
                  <div className="font-bold text-gray-900">Shipping Method</div>
                  <div className="text-center">:</div>
                  <div className="text-gray-700">Express Delivery</div>
                  
                  <div className="font-bold text-gray-900">Tracking Number</div>
                  <div className="text-center">:</div>
                  <div className="text-gray-700">TRK983724982</div>
                  
                  <div className="font-bold text-gray-900">Estimated Delivery</div>
                  <div className="text-center">:</div>
                  <div className="text-gray-700">Jul 16, 2026</div>
                </div>
              </div>
              
              {/* Notes */}
              <div className="bg-[#FFF9E6] border border-orange-100 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3 text-orange-600">
                  <FileText size={16} />
                  <span className="font-bold uppercase tracking-wider text-[11px]">Customer Notes</span>
                </div>
                <p className="text-[11px] text-gray-700 mb-2 leading-relaxed font-medium">Thank you for shopping with The BatStore.</p>
                <p className="text-[11px] text-gray-700 mb-2 leading-relaxed">For returns, exchanges, or warranty claims, please contact us within 30 days of delivery.</p>
                <p className="text-[11px] text-gray-700 leading-relaxed font-medium">We appreciate your business!</p>
              </div>

            </div>

            {/* Terms, QR & Signature */}
            <div className="flex justify-between items-end border-t border-gray-200 pt-8 pb-8">
              
              <div className="flex gap-6 items-center">
                <div className="w-24 h-24 bg-white border-2 border-gray-900 rounded p-1 flex items-center justify-center shrink-0">
                  <QrCode size={80} className="text-gray-900" />
                </div>
                <div>
                  <h4 className="font-bold text-[#0B409C] text-sm mb-1">Scan to verify invoice</h4>
                  <p className="text-[11px] text-gray-500 max-w-[160px] leading-relaxed">Point your camera at the QR code to verify this invoice is genuine.</p>
                </div>
              </div>
              
              <div className="flex-1 px-12">
                <div className="flex items-center gap-2 mb-3 text-[#0B409C]">
                  <FileCheck2 size={16} />
                  <span className="font-bold uppercase tracking-wider text-[11px]">Terms & Conditions</span>
                </div>
                <ul className="space-y-1.5">
                  {[
                    "Payment received in full.",
                    "Products can be returned within 30 days of delivery.",
                    "Warranty applies according to manufacturer policy.",
                    "This invoice serves as proof of purchase."
                  ].map((term, i) => (
                    <li key={i} className="flex items-start gap-2 text-[11px] text-gray-600">
                      <CheckCircle2 size={12} className="text-green-500 mt-0.5 shrink-0" />
                      {term}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="w-48 text-center">
                {/* Mock Signature Line */}
                <div className="h-16 flex items-end justify-center mb-2 pb-1">
                  <div 
                    className="text-gray-800"
                    style={{ 
                      fontFamily: "'Brush Script MT', 'Alex Brush', cursive", 
                      fontSize: "38px",
                      lineHeight: "1",
                      transform: "rotate(-4deg)"
                    }}
                  >
                    Andrew
                  </div>
                </div>
                <div className="border-t border-gray-400 pt-2">
                  <p className="text-[11px] font-bold text-gray-900">Authorized Signature</p>
                  <p className="text-[10px] text-gray-500">The BatStore Inc.</p>
                </div>
              </div>
            </div>
            
          </div>
          
          {/* Footer Area */}
          <div className="mt-auto">
            <div className="text-center mb-6 pt-2">
              <h3 className="text-[#0B409C] font-black text-lg mb-4">Thank you for choosing The BatStore!</h3>
              
              <div className="flex items-center justify-center gap-8 text-[11px] text-gray-600 mb-8">
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-[#0B409C]" />
                  <span>+1 (415) 555-0189</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-[#0B409C]" />
                  <span>support@thebatstore.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe size={14} className="text-[#0B409C]" />
                  <span>www.thebatstore.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-[#0B409C]" />
                  <span>123 Commerce Blvd, Suite 400<br/>San Francisco, CA 94105, USA</span>
                </div>
              </div>
              
              <div className="flex justify-center items-center gap-6 border-t border-gray-100 pt-6 px-10 mb-6">
                <div className="flex items-center gap-2">
                  <Lock size={20} className="text-emerald-500 stroke-[1.5]" />
                  <div className="text-left leading-tight">
                    <p className="text-[10px] font-bold text-gray-900 uppercase">SSL Secure</p>
                    <p className="text-[9px] text-gray-500">Encrypted Connection</p>
                  </div>
                </div>
                <div className="w-px h-8 bg-gray-200"></div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={20} className="text-[#0B409C] stroke-[1.5]" />
                  <div className="text-left leading-tight">
                    <p className="text-[10px] font-bold text-gray-900 uppercase">PCI DSS Compliant</p>
                    <p className="text-[9px] text-gray-500">Secure Payments</p>
                  </div>
                </div>
                <div className="w-px h-8 bg-gray-200"></div>
                <div className="flex items-center gap-2">
                  <CheckSquare size={20} className="text-emerald-500 stroke-[1.5]" />
                  <div className="text-left leading-tight">
                    <p className="text-[10px] font-bold text-gray-900 uppercase">Verified Merchant</p>
                    <p className="text-[9px] text-gray-500">Trusted & Reliable</p>
                  </div>
                </div>
                <div className="w-px h-8 bg-gray-200"></div>
                <div className="flex items-center gap-2">
                  <Shield size={20} className="text-emerald-500 stroke-[1.5]" />
                  <div className="text-left leading-tight">
                    <p className="text-[10px] font-bold text-gray-900 uppercase">256-Bit Encryption</p>
                    <p className="text-[9px] text-gray-500">Data Protection</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-[#0B409C] text-white py-3 px-10 flex justify-between items-center text-[11px]">
              <p>© 2026 The BatStore Inc. All rights reserved.</p>
              <p>Page 1 of 1</p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Invoice;
