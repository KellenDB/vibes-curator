// src/components/TerritoryDetails.tsx
import React, { useState, useMemo } from 'react';
import { 
  Territory, 
  TerritoryExpansionResponse, 
  UserContext 
} from '../types';
import ContextInputs from './ContextInputs';
import CopyButton from './CopyButton';
import DownloadButton from './DownloadButton';
import ErrorMessage from './ErrorMessage';
import SuccessMessage from './SuccessMessage';
import LoadingSpinner from './LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RefreshCw, 
  Settings, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  ArrowRight, 
  Eye, 
  MessageCircle, 
  Lightbulb, 
  Palette,
  LayoutGrid,
  Users,
  BookOpen,
  HelpCircle
} from 'lucide-react';

interface TerritoryDetailsProps {
  territory: Territory;
  expansionData: TerritoryExpansionResponse | null;
  isLoading: boolean;
  error: string | null;
  onUpdateContext: (territory: Territory, userContext: UserContext) => Promise<void>;
  originalContext: {
    product: string;
    direction: string;
    vibes: string[];
    approach?: {
      intent: string;
      vibes: string[];
    };
    brainstorm?: {
      workthrough: string;
    };
  };
}

const TerritoryDetails: React.FC<TerritoryDetailsProps> = ({
  territory,
  expansionData,
  isLoading,
  error,
  onUpdateContext,
  originalContext
}) => {
  const [showContextForm, setShowContextForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState({
    visualWorld: false,
    narrativeAngles: false,
    activationOpportunities: false,
    evolutionQuestions: false
  });
  
    // Generate dynamic colors based on territory name with jewel tones & metallics
    const colors = useMemo(() => {
    const getGradient = (str: string) => {
      // Simple hash function to get a number from string
      const hash = str.split('').reduce((acc, char) => {
        return char.charCodeAt(0) + ((acc << 5) - acc);
      }, 0);
      
      // Palette inspired by jewel tones, metallics, and warm neutrals that complement the app's red theme
      // All coordinated with the bone/red/white/black primary palette
      const palettes = [
        // Warm reds/burgundies
        { 
          main: 'hsla(352, 70%, 98%, 1)', 
          accent: 'hsla(352, 80%, 40%, 0.75)', 
          highlight: 'hsla(352, 70%, 50%, 0.12)',
          gradientStart: 'hsla(352, 70%, 40%, 1)',
          gradientEnd: 'hsla(352, 80%, 60%, 1)'
        },
        // Golds
        { 
          main: 'hsla(45, 60%, 98%, 1)', 
          accent: 'hsla(45, 80%, 50%, 0.75)', 
          highlight: 'hsla(45, 70%, 50%, 0.12)',
          gradientStart: 'hsla(45, 70%, 40%, 1)',
          gradientEnd: 'hsla(45, 80%, 60%, 1)'
        },
        // Copper/bronze
        { 
          main: 'hsla(30, 60%, 98%, 1)', 
          accent: 'hsla(30, 80%, 40%, 0.75)', 
          highlight: 'hsla(30, 70%, 40%, 0.12)',
          gradientStart: 'hsla(30, 70%, 40%, 1)',
          gradientEnd: 'hsla(30, 80%, 55%, 1)'
        },
        // Deep purple/amethyst (complementary to the red)
        { 
          main: 'hsla(280, 30%, 98%, 1)', 
          accent: 'hsla(280, 50%, 40%, 0.75)', 
          highlight: 'hsla(280, 40%, 40%, 0.12)',
          gradientStart: 'hsla(280, 50%, 35%, 1)',
          gradientEnd: 'hsla(280, 60%, 55%, 1)'
        },
        // Silver/platinum
        { 
          main: 'hsla(220, 15%, 98%, 1)', 
          accent: 'hsla(220, 30%, 60%, 0.75)', 
          highlight: 'hsla(220, 15%, 50%, 0.12)',
          gradientStart: 'hsla(220, 20%, 60%, 1)',
          gradientEnd: 'hsla(220, 15%, 75%, 1)'
        },
        // Warm amber
        { 
          main: 'hsla(35, 60%, 98%, 1)', 
          accent: 'hsla(35, 90%, 50%, 0.75)', 
          highlight: 'hsla(35, 80%, 50%, 0.12)',
          gradientStart: 'hsla(35, 80%, 40%, 1)',
          gradientEnd: 'hsla(35, 90%, 60%, 1)'
        },
        // Deep garnet
        { 
          main: 'hsla(340, 30%, 98%, 1)', 
          accent: 'hsla(340, 70%, 35%, 0.75)', 
          highlight: 'hsla(340, 60%, 40%, 0.12)',
          gradientStart: 'hsla(340, 60%, 35%, 1)',
          gradientEnd: 'hsla(340, 70%, 50%, 1)'
        },
        // Muted jade (harmonious with reds)
        { 
          main: 'hsla(150, 20%, 98%, 1)', 
          accent: 'hsla(150, 30%, 40%, 0.75)', 
          highlight: 'hsla(150, 25%, 40%, 0.12)',
          gradientStart: 'hsla(150, 25%, 35%, 1)',
          gradientEnd: 'hsla(150, 30%, 45%, 1)'
        }
      ];
      
      // Select palette based on hash
      const paletteIndex = Math.abs(hash) % palettes.length;
      return palettes[paletteIndex];
    };
    
    return getGradient(territory.territory);
  }, [territory.territory]);
  
  // Function to toggle section expansion
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  // Function to handle updating territory with new context
  const handleContextUpdate = async (newContext: UserContext) => {
    await onUpdateContext(territory, newContext);
    setShowContextForm(false);
    setSuccessMessage('Territory updated with new context!');
    setTimeout(() => setSuccessMessage(null), 3000);
  };
  
  // Function to prepare content for copying and downloading
  const prepareCopyContent = () => {
    if (!expansionData?.expansion) return '';
    
    const expansion = expansionData.expansion;
    const userContext = expansionData.userContext;
    
    let content = `# ${territory.territory} - Expansion\n\n`;
    
    // Add context if provided
    if (userContext?.focusArea || userContext?.primaryChannel || userContext?.targetAudience) {
      content += `## Context\n`;
      if (userContext.focusArea) content += `- Focus Area: ${userContext.focusArea}\n`;
      if (userContext.primaryChannel) content += `- Primary Channel: ${userContext.primaryChannel}\n`;
      if (userContext.targetAudience) content += `- Target Audience: ${userContext.targetAudience}\n`;
      content += `\n`;
    }
    
    content += `## Original Brief\n`;
    content += `- Product: ${originalContext.product}\n`;
    content += `- Direction: ${originalContext.direction}\n`;
    content += `- Vibes: ${originalContext.vibes.join(', ')}\n\n`;
    
    content += `## Visual World\n\n`;
    
    content += `### Aesthetics\n`;
    expansion.visual_world.aesthetics.forEach(item => {
      content += `- ${item}\n`;
    });
    
    content += `\n### Inspiration\n`;
    expansion.visual_world.inspiration.forEach(item => {
      content += `- ${item}\n`;
    });
    
    content += `\n### Signature Elements\n`;
    expansion.visual_world.signature_elements.forEach(item => {
      content += `- ${item}\n`;
    });
    
    content += `\n## Narrative Angles\n\n`;
    
    content += `### Key Stories\n`;
    expansion.narrative_angles.key_stories.forEach(item => {
      content += `- ${item}\n`;
    });
    
    content += `\n### Messaging Themes\n`;
    expansion.narrative_angles.messaging_themes.forEach(item => {
      content += `- ${item}\n`;
    });
    
    content += `\n### Tone Guidance\n${expansion.narrative_angles.tone_guidance}\n`;
    
    content += `\n## Activation Opportunities\n\n`;
    
    content += `### Key Moments\n`;
    expansion.activation_opportunities.key_moments.forEach(item => {
      content += `- ${item}\n`;
    });
    
    content += `\n### Platform Ideas\n`;
    expansion.activation_opportunities.platform_ideas.forEach(item => {
      content += `- ${item}\n`;
    });
    
    content += `\n### Engagement Hooks\n`;
    expansion.activation_opportunities.engagement_hooks.forEach(item => {
      content += `- ${item}\n`;
    });
    
    content += `\n## Evolution Questions\n`;
    expansion.evolution_questions.forEach(item => {
      content += `- ${item}\n`;
    });
    
    return content;
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: "auto",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 26,
        duration: 0.3
      }
    }
  };

  // If loading and no expansion data yet, show spinner
  if (isLoading && !expansionData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <LoadingSpinner text="Generating territory expansion..." />
      </div>
    );
  }

  // If error and no expansion data, show error message
  if (error && !expansionData) {
    return <ErrorMessage message={error} />;
  }

  // If no expansion data yet, show a placeholder
  if (!expansionData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] p-8 text-center">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-500 space-y-4"
        >
          <Sparkles className="w-12 h-12 text-secondary mx-auto opacity-50" />
          <p className="text-xl font-medium">Waiting for territory expansion...</p>
          <p className="text-gray-400 max-w-md mx-auto">
            When you're ready, click "Explore this territory" to generate a detailed 
            expansion with visual elements, narrative angles, and activation ideas.
          </p>
        </motion.div>
      </div>
    );
  }

  const expansion = expansionData.expansion;
  const userContext = expansionData.userContext;

  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Territory overview and context */}
      <motion.div 
        className="bg-card rounded-lg shadow-sm border border-border overflow-hidden"
        variants={itemVariants}
        style={{
          background: `linear-gradient(135deg, ${colors.main}, white)`
        }}
      >
        {/* Accent bar */}
        <div 
          className="h-1 w-full"
          style={{ 
            background: `linear-gradient(to right, ${colors.accent}, transparent 80%)`
          }}
        />
        
        <div className="p-6 relative">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold tracking-tight">{territory.territory}</h2>
            <p className="text-gray-700 mt-2">{territory['Mood & Tone']}</p>
          </div>
          
          {/* Context badge section */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-2">Applied Context</h3>
              <div className="flex flex-wrap gap-2">
                {userContext?.focusArea ? (
                  <div className="px-3 py-1 rounded-full text-sm bg-background border border-border">
                    <span className="font-medium">Focus:</span> {userContext.focusArea}
                  </div>
                ) : null}
                
                {userContext?.primaryChannel ? (
                  <div className="px-3 py-1 rounded-full text-sm bg-background border border-border">
                    <span className="font-medium">Channel:</span> {userContext.primaryChannel}
                  </div>
                ) : null}
                
                {userContext?.targetAudience ? (
                  <div className="px-3 py-1 rounded-full text-sm bg-background border border-border">
                    <span className="font-medium">Audience:</span> {userContext.targetAudience}
                  </div>
                ) : null}
                
                {!userContext?.focusArea && !userContext?.primaryChannel && !userContext?.targetAudience && (
                  <div className="text-gray-500 text-sm italic">No additional context applied</div>
                )}
              </div>
            </div>
            
            <motion.button
              onClick={() => setShowContextForm(!showContextForm)}
              className="inline-flex items-center px-4 py-2 border border-border shadow-sm text-sm font-medium rounded-full 
                        bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {showContextForm ? (
                <>Hide Context Form</>
              ) : (
                <>
                  <Settings className="w-4 h-4 mr-1.5" />
                  Update Context
                </>
              )}
            </motion.button>
          </div>
          
          {/* Success Message */}
          <AnimatePresence>
            {successMessage && (
              <motion.div 
                className="mt-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <SuccessMessage message={successMessage} onDismiss={() => setSuccessMessage(null)} />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div 
                className="mt-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <ErrorMessage message={error} />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Context update form */}
          <AnimatePresence>
            {showContextForm && (
              <motion.div 
                className="mt-6 border-t border-border pt-4"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <h3 className="text-lg font-medium mb-4">Update Context</h3>
                <div className="max-w-lg mx-auto">
                  <ContextInputs
                    onSubmit={handleContextUpdate}
                    onCancel={() => setShowContextForm(false)}
                    isLoading={isLoading}
                    initialContext={userContext}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Export options */}
          <div className="mt-6 flex justify-end space-x-4">
            <CopyButton 
              text={prepareCopyContent()} 
              label="Copy All" 
            />
            <DownloadButton 
              content={prepareCopyContent()}
              filename={`${territory.territory.toLowerCase().replace(/\s+/g, '-')}-expansion.md`}
              label="Download MD"
            />
          </div>
          
          {/* Visual decoration element */}
          <div
            className="absolute -bottom-12 -right-12 w-36 h-36 rounded-full opacity-15"
            style={{ 
              background: `radial-gradient(circle, ${colors.accent} 0%, transparent 70%)`
            }}
          />
        </div>
      </motion.div>
      
      {/* Loading overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            className="fixed inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-center">
              <LoadingSpinner text="Updating territory expansion..." />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Visual World Section */}
      <motion.div 
        className="bg-card rounded-lg shadow-sm border border-border overflow-hidden"
        variants={itemVariants}
      >
        <button 
          onClick={() => toggleSection('visualWorld')}
          className="w-full flex items-center justify-between p-6 border-b border-border hover:bg-gray-50/50 transition-colors"
        >
          <div className="flex items-center">
            <Palette className="w-5 h-5 text-secondary mr-3" />
            <h2 className="text-xl font-semibold tracking-tight text-card-foreground">Visual World</h2>
          </div>
          {expandedSections.visualWorld ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>
        
        <AnimatePresence>
          {expandedSections.visualWorld && (
            <motion.div 
              className="p-6 space-y-8"
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <div>
                <h3 className="text-md font-medium text-gray-800 mb-3 flex items-center">
                  <Eye className="w-4 h-4 mr-2 text-secondary opacity-80" />
                  Aesthetics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {expansion.visual_world.aesthetics.map((item, i) => (
                    <motion.div 
                      key={i} 
                      className="p-4 bg-background rounded-lg border border-border shadow-sm"
                      whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}
                      transition={{ duration: 0.2 }}
                    >
                      {item}
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-md font-medium text-gray-800 mb-3 flex items-center">
                  <Sparkles className="w-4 h-4 mr-2 text-secondary opacity-80" />
                  Inspiration
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {expansion.visual_world.inspiration.map((item, i) => (
                    <motion.div 
                      key={i} 
                      className="p-4 bg-background rounded-lg border border-border shadow-sm"
                      whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}
                      transition={{ duration: 0.2 }}
                    >
                      {item}
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-md font-medium text-gray-800 mb-3 flex items-center">
                  <LayoutGrid className="w-4 h-4 mr-2 text-secondary opacity-80" />
                  Signature Elements
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {expansion.visual_world.signature_elements.map((item, i) => (
                    <motion.div 
                      key={i} 
                      className="p-4 bg-background rounded-lg border border-border shadow-sm"
                      whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}
                      transition={{ duration: 0.2 }}
                    >
                      {item}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      {/* Narrative Angles Section */}
      <motion.div 
        className="bg-card rounded-lg shadow-sm border border-border overflow-hidden"
        variants={itemVariants}
      >
        <button 
          onClick={() => toggleSection('narrativeAngles')}
          className="w-full flex items-center justify-between p-6 border-b border-border hover:bg-gray-50/50 transition-colors"
        >
          <div className="flex items-center">
            <BookOpen className="w-5 h-5 text-secondary mr-3" />
            <h2 className="text-xl font-semibold tracking-tight text-card-foreground">Narrative Angles</h2>
          </div>
          {expandedSections.narrativeAngles ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>
        
        <AnimatePresence>
          {expandedSections.narrativeAngles && (
            <motion.div 
              className="p-6 space-y-8"
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <div>
                <h3 className="text-md font-medium text-gray-800 mb-3 flex items-center">
                  <ArrowRight className="w-4 h-4 mr-2 text-secondary opacity-80" />
                  Key Stories
                </h3>
                <div className="space-y-4">
                  {expansion.narrative_angles.key_stories.map((item, i) => (
                    <motion.div 
                      key={i} 
                      className="p-4 bg-background rounded-lg border border-border shadow-sm"
                      whileHover={{ x: 2, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}
                      transition={{ duration: 0.2 }}
                    >
                      {item}
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-md font-medium text-gray-800 mb-3 flex items-center">
                  <MessageCircle className="w-4 h-4 mr-2 text-secondary opacity-80" />
                  Messaging Themes
                </h3>
                <div className="space-y-4">
                  {expansion.narrative_angles.messaging_themes.map((item, i) => (
                    <motion.div 
                      key={i} 
                      className="p-4 bg-background rounded-lg border border-border shadow-sm"
                      whileHover={{ x: 2, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}
                      transition={{ duration: 0.2 }}
                    >
                      {item}
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-md font-medium text-gray-800 mb-3 flex items-center">
                  <Users className="w-4 h-4 mr-2 text-secondary opacity-80" />
                  Tone Guidance
                </h3>
                <motion.div 
                  className="p-4 bg-background rounded-lg border border-border shadow-sm"
                  whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}
                  transition={{ duration: 0.2 }}
                >
                  {expansion.narrative_angles.tone_guidance}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      {/* Activation Opportunities Section */}
      <motion.div 
        className="bg-card rounded-lg shadow-sm border border-border overflow-hidden"
        variants={itemVariants}
      >
        <button 
          onClick={() => toggleSection('activationOpportunities')}
          className="w-full flex items-center justify-between p-6 border-b border-border hover:bg-gray-50/50 transition-colors"
        >
          <div className="flex items-center">
            <Lightbulb className="w-5 h-5 text-secondary mr-3" />
            <h2 className="text-xl font-semibold tracking-tight text-card-foreground">Activation Opportunities</h2>
          </div>
          {expandedSections.activationOpportunities ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>
        
        <AnimatePresence>
          {expandedSections.activationOpportunities && (
            <motion.div 
              className="p-6 space-y-8"
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <div>
                <h3 className="text-md font-medium text-gray-800 mb-3 flex items-center">
                  <ArrowRight className="w-4 h-4 mr-2 text-secondary opacity-80" />
                  Key Moments
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {expansion.activation_opportunities.key_moments.map((item, i) => (
                    <motion.div 
                      key={i} 
                      className="p-4 bg-background rounded-lg border border-border shadow-sm"
                      whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}
                      transition={{ duration: 0.2 }}
                    >
                      {item}
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-md font-medium text-gray-800 mb-3 flex items-center">
                  <LayoutGrid className="w-4 h-4 mr-2 text-secondary opacity-80" />
                  Platform Ideas
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {expansion.activation_opportunities.platform_ideas.map((item, i) => (
                    <motion.div 
                      key={i} 
                      className="p-4 bg-background rounded-lg border border-border shadow-sm"
                      whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}
                      transition={{ duration: 0.2 }}
                    >
                      {item}
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-md font-medium text-gray-800 mb-3 flex items-center">
                  <Users className="w-4 h-4 mr-2 text-secondary opacity-80" />
                  Engagement Hooks
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {expansion.activation_opportunities.engagement_hooks.map((item, i) => (
                    <motion.div 
                      key={i} 
                      className="p-4 bg-background rounded-lg border border-border shadow-sm"
                      whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}
                      transition={{ duration: 0.2 }}
                    >
                      {item}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      {/* Evolution Questions Section */}
      <motion.div 
        className="bg-card rounded-lg shadow-sm border border-border overflow-hidden"
        variants={itemVariants}
      >
        <button 
          onClick={() => toggleSection('evolutionQuestions')}
          className="w-full flex items-center justify-between p-6 border-b border-border hover:bg-gray-50/50 transition-colors"
        >
          <div className="flex items-center">
            <HelpCircle className="w-5 h-5 text-secondary mr-3" />
            <h2 className="text-xl font-semibold tracking-tight text-card-foreground">Evolution Questions</h2>
          </div>
          {expandedSections.evolutionQuestions ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>
        
        <AnimatePresence>
          {expandedSections.evolutionQuestions && (
            <motion.div 
              className="p-6"
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <ul className="space-y-4">
                {expansion.evolution_questions.map((question, i) => (
                  <motion.li 
                    key={i} 
                    className="p-4 bg-background rounded-lg border border-border shadow-sm flex"
                    whileHover={{ x: 4, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="text-secondary mr-3">•</span>
                    <span>{question}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default TerritoryDetails;