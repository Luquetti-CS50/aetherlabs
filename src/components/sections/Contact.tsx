import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Instagram, Twitter, Youtube } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const Contact = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: t.contact.form.error,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    setTimeout(() => {
      toast({
        title: t.contact.form.success,
      });
      setFormData({ name: "", email: "", message: "" });
      setIsSubmitting(false);
    }, 1000);
  };

  const socialLinks = [
    { icon: Instagram, handle: "@industriesaether", url: "https://www.instagram.com/industriesaether?igsh=MTVma3cxZXUyeWllag==" },
    { icon: Twitter, handle: "@GlobalAether", url: "https://x.com/GlobalAether?t=GuI0EvXH78mhsUaVJsb_Lg&s=09" },
    { icon: Youtube, handle: "@aetherglobal", url: "https://youtube.com/@aetherglobal?si=HL8xpgH50EYSqae9" },
  ];

  return (
    <section
      id="contact"
      className="min-h-screen flex items-center justify-center px-6 py-20"
      style={{ scrollMarginTop: "120px" }}
      aria-labelledby="contact-heading"
    >
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="glass rounded-2xl p-6 md:p-10 lg:p-12 space-y-8 md:space-y-10 lg:space-y-12"
        >
          <div className="text-center space-y-4">
            <h2 id="contact-heading" className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary">
              {t.contact.title}
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-muted-foreground">
              {t.contact.subtitle}
            </p>
          </div>

          <div className="space-y-6 md:space-y-8">
            <div className="text-center space-y-4 md:space-y-6">
              <h3 className="text-xl md:text-2xl font-bold" style={{
                background: "var(--gradient-primary)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                {t.contact.social}
              </h3>
              
              <div className="flex justify-center gap-4 md:gap-6 lg:gap-8">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="group flex flex-col items-center gap-2"
                      aria-label={social.handle}
                    >
                      <div className="relative">
                        <div 
                          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{
                            background: "var(--gradient-primary)",
                            filter: "blur(15px)",
                          }}
                        />
                        <div className="relative z-10 w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full glass flex items-center justify-center
                                      group-hover:scale-110 transition-transform duration-300">
                          <Icon 
                            className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-muted-foreground group-hover:text-foreground transition-colors" 
                          />
                        </div>
                      </div>
                      <span className="text-xs md:text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                        {social.handle}
                      </span>
                    </motion.a>
                  );
                })}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                placeholder={t.contact.form.name}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="glass border-border text-foreground"
              />

              <Input
                type="email"
                placeholder={t.contact.form.email}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="glass border-border text-foreground"
              />

              <Textarea
                placeholder={t.contact.form.message}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="glass border-border text-foreground min-h-32"
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full text-lg font-medium py-6 relative overflow-hidden group"
                style={{
                  background: "var(--gradient-button)",
                  color: "white",
                }}
              >
                <span className="relative z-10">
                  {isSubmitting ? t.contact.form.sending : t.contact.form.send}
                </span>
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
