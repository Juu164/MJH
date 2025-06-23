import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, ListChecks, CreditCard } from "lucide-react";

export function HomePage() {
  const features = [
    {
      icon: Calendar,
      title: "Planification",
      desc: "Organisez facilement vos répétitions et concerts avec un agenda partagé.",
    },
    {
      icon: ListChecks,
      title: "Calendrier",
      desc: "Suivez tous les événements importants de votre groupe en un coup d'œil.",
    },
    {
      icon: CreditCard,
      title: "Facturation",
      desc: "Générez vos factures et suivez les paiements sans effort.",
    },
  ];

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center justify-center text-center p-8 h-screen bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-800 via-gray-900 to-black"
      >
        <h1 className="text-5xl md:text-7xl font-extrabold mb-4 font-heading">
          Welcome to CalZik
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl">
          Gérez vos concerts, disponibilités et factures au même endroit.
        </p>
        <button
          onClick={() => navigate("/calendar")}
          className="px-6 py-3 rounded-full bg-primary hover:bg-primary/90 transition-colors"
        >
          Découvrir le calendrier
        </button>
      </motion.section>

      <section className="py-16 bg-gray-950">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-3 gap-8 text-center">
          {features.map(({ icon: Icon, title, desc }) => (
            <motion.div
              key={title}
              whileHover={{ boxShadow: "0 0 15px rgba(255,255,255,0.6)" }}
              className="p-6 bg-gray-800 rounded-xl space-y-4"
            >
              <Icon className="w-10 h-10 mx-auto text-accent" />
              <h3 className="text-xl font-semibold">{title}</h3>
              <p className="text-gray-300 text-sm">{desc}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link
            to="/calendar"
            className="px-6 py-3 rounded-full bg-accent hover:bg-accent/90 transition-colors"
          >
            Commencer
          </Link>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
