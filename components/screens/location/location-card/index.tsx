import React, { useState } from "react";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";
import { 
  CloudRainWind, 
  CloudSun, 
  Wind, 
  Bike, 
  Book, 
  Moon, 
  Coffee,
  Gamepad2,
  Music,
  Plus,
  Power,
  PowerOff
} from "lucide-react-native";
import { VStack } from "@/components/ui/vstack";
import { Pressable } from "@/components/ui/pressable";
import { Button } from "@/components/ui/button";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
} from "react-native-reanimated";

interface IActivityCard {
  id: number;
  activityName: string;
  details: string;
  duration: string;
  priority: "High" | "Medium" | "Low";
  status: "Active" | "Paused" | "Completed";
  category: string;
  isSelected: boolean;
  setSelectedCard: (key: number) => void;
  onDelete?: (id: number) => void;
}

interface IActivityCardList {
  activities: IActivityCard[];
  setActivities: React.Dispatch<React.SetStateAction<IActivityCard[]>>;
}

// Icon mapping for different activities
const getActivityIcon = (activityName: string) => {
  const name = activityName.toLowerCase();
  if (name.includes('bike') || name.includes('cycling')) return Bike;
  if (name.includes('study') || name.includes('read')) return Book;
  if (name.includes('sleep') || name.includes('rest')) return Moon;
  if (name.includes('coffee') || name.includes('break')) return Coffee;
  if (name.includes('game') || name.includes('play')) return Gamepad2;
  if (name.includes('music') || name.includes('listen')) return Music;
  return CloudRainWind; // default icon
};

const ActivityCard = ({
  id,
  activityName,
  details,
  duration,
  priority,
  status,
  category,
  isSelected,
  setSelectedCard,
  onDelete,
}: IActivityCard) => {
  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: status === "Completed" ? 0.7 : 1,
    };
  });

  const handlePress = () => {
    scale.value = withSequence(withSpring(0.9), withSpring(1));
    setSelectedCard(id);
  };

  const getPriorityColor = () => {
    switch (priority) {
      case "High": return "text-error-600";
      case "Medium": return "text-warning-600";
      case "Low": return "text-success-600";
      default: return "text-typography-600";
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "Active": return "text-success-600";
      case "Paused": return "text-warning-600";
      case "Completed": return "text-typography-500";
      default: return "text-typography-600";
    }
  };

  const ActivityIcon = getActivityIcon(activityName);

  return (
    <AnimatedPressable
      className={`p-4 rounded-[18px] gap-4 flex-col ${
        isSelected ? "bg-primary-50 border-2 border-primary-300" : "bg-background-100"
      } ${status === "Completed" ? "opacity-75" : ""}`}
      onPress={handlePress}
      style={animatedStyle}
    >
      <HStack>
        <VStack className="flex-1">
          <HStack className="items-center" space="xs">
            <Icon as={ActivityIcon} size="sm" className="text-primary-600" />
            <Text size="lg" className="font-semibold text-typography-700">
              {activityName}
            </Text>
          </HStack>
          <Text size="sm" className="font-medium text-typography-600">
            {details}
          </Text>
        </VStack>

        <VStack className="items-end">
          <Text size="sm" className={`font-semibold ${getPriorityColor()}`}>
            {priority}
          </Text>
          <Text size="xs" className="text-typography-500">
            {duration}
          </Text>
        </VStack>
      </HStack>

      <HStack className="justify-between items-center">
        <HStack space="md">
          <HStack space="xs">
            <Text className={`font-medium ${getStatusColor()}`} size="xs">
              {status}
            </Text>
          </HStack>

          <HStack space="xs">
            <Text className="text-typography-600 font-medium" size="xs">
              {category}
            </Text>
            <Icon as={CloudSun} size="xs" className="text-typography-600" />
          </HStack>
        </HStack>

        {onDelete && (
          <Pressable
            onPress={() => onDelete(id)}
            className="p-1"
          >
            <Text className="text-error-600 font-medium" size="xs">
              Delete
            </Text>
          </Pressable>
        )}
      </HStack>
    </AnimatedPressable>
  );
};

const AddNewActivityCard = ({ onAdd }: { onAdd: (activity: Omit<IActivityCard, 'id' | 'isSelected' | 'setSelectedCard'>) => void }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newActivity, setNewActivity] = useState<{
    activityName: string;
    details: string;
    duration: string;
    priority: "High" | "Medium" | "Low";
    status: "Active";
    category: string;
  }>({
    activityName: '',
    details: '',
    duration: '',
    priority: 'Medium',
    status: 'Active',
    category: 'Personal',
  });

  const handleAdd = () => {
    if (newActivity.activityName.trim()) {
      onAdd(newActivity);
      setNewActivity({
        activityName: '',
        details: '',
        duration: '',
        priority: 'Medium',
        status: 'Active',
        category: 'Personal',
      });
      setIsExpanded(false);
    }
  };

  if (!isExpanded) {
    return (
      <Pressable
        className="p-4 rounded-[18px] bg-background-50 border-2 border-dashed border-outline-300 items-center justify-center min-h-[100px]"
        onPress={() => setIsExpanded(true)}
      >
        <VStack className="items-center" space="sm">
          <Icon as={Plus} size="lg" className="text-outline-400" />
          <Text className="text-outline-600 font-medium">
            Add New Activity
          </Text>
        </VStack>
      </Pressable>
    );
  }

  return (
    <VStack className="p-4 rounded-[18px] bg-background-100 gap-3">
      <Text size="lg" className="font-semibold text-typography-700">
        New Activity
      </Text>
      
      {/* <Input
        placeholder="Activity name (e.g., Riding bike, Studying, Sleeping)"
        value={newActivity.activityName}
        onChangeText={(text) => setNewActivity(prev => ({ ...prev, activityName: text }))}
      /> */}
      
      {/* <Input
        placeholder="Details"
        value={newActivity.details}
        onChangeText={(text) => setNewActivity(prev => ({ ...prev, details: text }))}
      /> */}
      
      {/* <HStack space="sm">
        <Input
          placeholder="Duration"
          value={newActivity.duration}
          onChangeText={(text) => setNewActivity(prev => ({ ...prev, duration: text }))}
          className="flex-1"
        />
        <Input
          placeholder="Category"
          value={newActivity.category}
          onChangeText={(text) => setNewActivity(prev => ({ ...prev, category: text }))}
          className="flex-1"
        />
      </HStack> */}

      <HStack className="justify-between">
        <HStack space="xs">
          {(['High', 'Medium', 'Low'] as const).map((priority) => (
            <Pressable
              key={priority}
              className={`px-3 py-1 rounded-full ${
                newActivity.priority === priority 
                  ? 'bg-primary-100 border border-primary-300' 
                  : 'bg-background-50 border border-outline-200'
              }`}
              onPress={() => setNewActivity(prev => ({ ...prev, priority }))}
            >
              <Text size="xs" className={
                newActivity.priority === priority 
                  ? 'text-primary-700 font-medium' 
                  : 'text-typography-600'
              }>
                {priority}
              </Text>
            </Pressable>
          ))}
        </HStack>

        <HStack space="sm">
          <Button size="sm" variant="outline" onPress={() => setIsExpanded(false)}>
            <Text>Cancel</Text>
          </Button>
          <Button size="sm" onPress={handleAdd}>
            <Text>Add</Text>
          </Button>
        </HStack>
      </HStack>
    </VStack>
  );
};

const ActivityCardList = ({ activities, setActivities }: IActivityCardList) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  const handleAddActivity = (newActivity: Omit<IActivityCard, 'id' | 'isSelected' | 'setSelectedCard'>) => {
    const id = Math.max(...activities.map(a => a.id), 0) + 1;
    setActivities(prev => [...prev, {
      ...newActivity,
      id,
      isSelected: false,
      setSelectedCard: () => {},
    }]);
  };

  const handleDeleteActivity = (id: number) => {
    setActivities(prev => prev.filter(activity => activity.id !== id));
    if (selectedCard === id) {
      setSelectedCard(null);
    }
  };

  const handleCardSelection = (id: number) => {
    if (isEnabled) {
      setSelectedCard(selectedCard === id ? null : id);
    }
  };

  return (
    <VStack space="md" className="p-4">
      {/* Enable/Disable Toggle */}
      <HStack className="items-center justify-between p-4 bg-background-100 rounded-[18px]">
        <VStack>
          <Text size="lg" className="font-semibold text-typography-700">
            Activity Management
          </Text>
          <Text size="sm" className="text-typography-600">
            {isEnabled ? "Activities are enabled and interactive" : "Enable to interact with activities"}
          </Text>
        </VStack>
        
        <Pressable
          className={`p-2 rounded-full ${isEnabled ? 'bg-success-100' : 'bg-outline-100'}`}
          onPress={() => setIsEnabled(!isEnabled)}
        >
          <Icon 
            as={isEnabled ? Power : PowerOff} 
            size="md" 
            className={isEnabled ? 'text-success-600' : 'text-outline-500'}
          />
        </Pressable>
      </HStack>

      {/* Activity Cards */}
      <VStack space="sm">
        {activities.map((activity) => (
          <ActivityCard
            key={activity.id}
            {...activity}
            isSelected={isEnabled && selectedCard === activity.id}
            setSelectedCard={handleCardSelection}
            onDelete={isEnabled ? handleDeleteActivity : undefined}
          />
        ))}
        
        {/* Add New Activity Card */}
        {isEnabled && (
          <AddNewActivityCard onAdd={handleAddActivity} />
        )}
      </VStack>

      {/* Selected Activity Info */}
      {isEnabled && selectedCard && (
        <VStack className="p-4 bg-primary-50 rounded-[18px] border border-primary-200">
          <Text size="md" className="font-semibold text-primary-700">
            Selected Activity
          </Text>
          <Text size="sm" className="text-primary-600">
            {activities.find(a => a.id === selectedCard)?.activityName} is currently selected
          </Text>
        </VStack>
      )}
    </VStack>
  );
};

// Example usage component
const ExampleActivityApp = () => {
  const [activities, setActivities] = useState<IActivityCard[]>([
    {
      id: 1,
      activityName: "Riding Bike",
      details: "Morning bike ride in the park",
      duration: "45 mins",
      priority: "High",
      status: "Active",
      category: "Exercise",
      isSelected: false,
      setSelectedCard: () => {},
    },
    {
      id: 2,
      activityName: "Studying",
      details: "React Native development",
      duration: "2 hours",
      priority: "High",
      status: "Active",
      category: "Learning",
      isSelected: false,
      setSelectedCard: () => {},
    },
    {
      id: 3,
      activityName: "Sleeping",
      details: "Night rest and recovery",
      duration: "8 hours",
      priority: "Medium",
      status: "Completed",
      category: "Health",
      isSelected: false,
      setSelectedCard: () => {},
    }
  ]);

  return (
    <ActivityCardList 
      activities={activities} 
      setActivities={setActivities} 
    />
  );
};

export { ActivityCard, AddNewActivityCard, ActivityCardList };
export default ExampleActivityApp;