
import React from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, MessageSquare, Heart, Utensils, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const LandingPage: React.FC = () => {
  const scrollToLogin = () => {
    document.getElementById('login-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const featureVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.5 } 
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/10 to-background z-0"></div>
        <div className="container px-4 mx-auto relative z-10">
          <motion.div 
            className="text-center max-w-3xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <div className="flex justify-center mb-6">
              <ChefHat className="h-16 w-16 text-primary float-animation" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Your Personal Recipe & Meal Planning Assistant
            </h1>
            <p className="text-lg md:text-xl mb-8 text-muted-foreground">
              Discover personalized recipes, plan your meals effortlessly, and achieve your culinary goals with our AI-powered assistant.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={scrollToLogin} 
                size="lg" 
                className="text-lg px-8 hover-scale"
              >
                Get Started
              </Button>
              <Button 
                onClick={scrollToLogin} 
                variant="outline"
                size="lg" 
                className="text-lg px-8"
              >
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -bottom-10 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-background z-10"></div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-background">
        <div className="container px-4 mx-auto">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Simplify Your Meal Planning</h2>
            <p className="text-lg text-muted-foreground mb-12">
              Our AI-powered assistant learns your preferences, dietary needs, and cooking habits to provide personalized 
              recipe recommendations and meal plans tailored just for you.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
          >
            <motion.div 
              className="bg-card p-6 rounded-xl shadow-sm border border-border text-center"
              variants={featureVariants}
            >
              <MessageSquare className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Interactive Chat</h3>
              <p className="text-muted-foreground">
                Ask questions, get recommendations, and receive step-by-step cooking instructions in real-time.
              </p>
            </motion.div>

            <motion.div 
              className="bg-card p-6 rounded-xl shadow-sm border border-border text-center"
              variants={featureVariants}
            >
              <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Personalized Memory</h3>
              <p className="text-muted-foreground">
                Your assistant remembers your preferences, allergies, and favorite cuisines for a tailored experience.
              </p>
            </motion.div>

            <motion.div 
              className="bg-card p-6 rounded-xl shadow-sm border border-border text-center"
              variants={featureVariants}
            >
              <Utensils className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Recipe Suggestions</h3>
              <p className="text-muted-foreground">
                Get personalized recipe ideas based on your ingredients, dietary goals, and cooking skills.
              </p>
            </motion.div>

            <motion.div 
              className="bg-card p-6 rounded-xl shadow-sm border border-border text-center"
              variants={featureVariants}
            >
              <Calendar className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Meal Planning</h3>
              <p className="text-muted-foreground">
                Plan your daily, weekly, or monthly meals with nutritional insights and shopping lists.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-accent/10">
        <div className="container px-4 mx-auto">
          <motion.div 
            className="max-w-3xl mx-auto text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose Our Recipe Assistant?</h2>
            <p className="text-lg text-muted-foreground">
              We combine cutting-edge AI with a passion for good food to create the most helpful and personalized cooking companion.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div 
              className="order-2 md:order-1"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
            >
              <div className="space-y-8">
                <div className="flex gap-4 items-start">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <ChefHat className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Expert Recommendations</h3>
                    <p className="text-muted-foreground">
                      Get recipes curated to match your taste preferences and dietary requirements.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <MessageSquare className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Conversational Experience</h3>
                    <p className="text-muted-foreground">
                      Interact naturally with our chatbot just like you would with a real cooking assistant.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Organized Planning</h3>
                    <p className="text-muted-foreground">
                      Never worry about "what to cook" again with our smart meal planning features.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="order-1 md:order-2"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-card p-6 rounded-xl shadow-md border border-border overflow-hidden">
                <div className="bg-accent/20 p-4 rounded-lg mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-3 w-3 rounded-full bg-destructive"></div>
                    <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-background p-3 rounded-lg">
                      <p className="text-sm">What can I make with chicken and potatoes?</p>
                    </div>
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <p className="text-sm">Here are 3 recipes you can make with chicken and potatoes:</p>
                      <p className="text-sm mt-2">1. Herb Roasted Chicken with Garlic Potatoes</p>
                      <p className="text-sm">2. Chicken and Potato Curry</p>
                      <p className="text-sm">3. One-Pan Chicken and Potato Bake</p>
                      <p className="text-sm mt-2">Would you like me to show you the recipe for any of these?</p>
                    </div>
                  </div>
                </div>
                <div className="text-center text-sm text-muted-foreground">
                  Experience real-time, helpful cooking assistance
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action / Login Section */}
      <section id="login-section" className="py-20 bg-gradient-to-b from-background to-accent/20">
        <div className="container px-4 mx-auto">
          <motion.div 
            className="max-w-3xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <div className="text-center bg-card p-8 rounded-xl shadow-md border border-border">
              <ChefHat className="h-16 w-16 mx-auto text-primary mb-6" />
              <h2 className="text-3xl font-bold mb-2">Ready to Start Cooking?</h2>
              <p className="text-muted-foreground mb-8">
                Sign in to your account to start getting personalized recipe recommendations.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/login">
                  <Button className="text-lg px-8 w-full">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="outline" className="text-lg px-8 w-full">
                    Create Account
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <ChefHat className="h-6 w-6 text-primary mr-2" />
              <span className="font-semibold">Recipe Assistant</span>
            </div>
            
            <div className="flex gap-6">
              <Link to="#" className="text-muted-foreground hover:text-primary transition-colors">About</Link>
              <Link to="#" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link>
              <Link to="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy</Link>
            </div>
            
            <div className="text-sm text-muted-foreground mt-4 md:mt-0">
              &copy; {new Date().getFullYear()} Recipe Assistant. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
