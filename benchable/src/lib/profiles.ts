import { supabase } from './supabase';

export interface Profile {
  id: string;
  user_id: string;
  points: number;
  level: string;
  benches_visited: number;
  reviews: number;
  created_at: string;
  updated_at: string;
}

// Create a new profile when a user signs up
export const createProfile = async (userId: string) => {
  console.log('Creating profile for user:', userId);
  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert([
        {
          user_id: userId,
          points: 0,
          level: 'Bench Beginner',
          benches_visited: 0,
          reviews: 0,
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating profile:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      throw error;
    }
    
    console.log('Profile created successfully:', data);
    return data;
  } catch (error) {
    console.error('Unexpected error in createProfile:', error);
    throw error;
  }
};

// Get a user's profile
export const getProfile = async (userId: string) => {
  console.log('Getting profile for user:', userId);
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle(); // returns null if no row instead of throwing

    if (error) {
      console.error('Error getting profile:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      return null; // fail gracefully
    }

    if (!data) {
      console.log('No profile found for user:', userId);
      return null; // return null to signal that profile needs creation
    }

    console.log('Profile retrieved successfully:', data);
    return data;
  } catch (err) {
    console.error('Unexpected error in getProfile:', err);
    return null;
  }
};


// Update a user's profile
export const updateProfile = async (userId: string, updates: Partial<Profile>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Increment points
export const incrementPoints = async (userId: string, points: number) => {
  const { data, error } = await supabase.rpc('increment_points', {
    user_id: userId,
    points_to_add: points
  });

  if (error) throw error;
  return data;
};

// Increment benches visited
export const incrementBenchesVisited = async (userId: string) => {
  const { data, error } = await supabase.rpc('increment_benches_visited', {
    user_id: userId
  });

  if (error) throw error;
  return data;
};

// Increment reviews
export const incrementReviews = async (userId: string) => {
  const { data, error } = await supabase.rpc('increment_reviews', {
    user_id: userId
  });

  if (error) throw error;
  return data;
}; 