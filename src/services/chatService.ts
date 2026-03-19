import { db, auth } from './firebase';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  doc,
  updateDoc,
  serverTimestamp,
  getDocs,
  Timestamp
} from 'firebase/firestore';

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  userId: string;
  conversationId: string;
}

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  lastMessage: string;
  createdAt: Date;
  updatedAt: Date;
}

// Update conversation title
export const updateConversationTitle = async (conversationId: string, newTitle: string): Promise<void> => {
  try {
    const conversationRef = doc(db, 'conversations', conversationId);
    await updateDoc(conversationRef, {
      title: newTitle,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating conversation title:', error);
    throw error;
  }
};

// Save a message to Firestore
export const saveMessage = async (
  conversationId: string,
  content: string,
  role: 'user' | 'assistant'
): Promise<void> => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('User not authenticated');

    // Save the message in the subcollection
    await addDoc(collection(db, 'conversations', conversationId, 'messages'), {
      content,
      role,
      timestamp: serverTimestamp(),
    });

    // Update conversation's last message and timestamp
    const conversationRef = doc(db, 'conversations', conversationId);
    await updateDoc(conversationRef, {
      lastMessage: content.substring(0, 100),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error saving message:', error);
    throw error;
  }
};

// Get user's conversations
export const getUserConversations = async (userId: string): Promise<Conversation[]> => {
  try {
    const q = query(
      collection(db, 'conversations'),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: (doc.data().createdAt as Timestamp)?.toDate() || new Date(),
      updatedAt: (doc.data().updatedAt as Timestamp)?.toDate() || new Date()
    })) as Conversation[];
  } catch (error) {
    console.error('Error getting conversations:', error);
    throw error;
  }
};

// Subscribe to messages in a conversation (real-time updates)
export const subscribeToMessages = (
  conversationId: string,
  callback: (messages: ChatMessage[]) => void
) => {
  const q = query(
    collection(db, 'conversations', conversationId, 'messages'),
    orderBy('timestamp', 'asc')
  );

  return onSnapshot(
    q,
    {
      next: (snapshot) => {
        const messages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          timestamp: (doc.data().timestamp as Timestamp)?.toDate() || new Date(),
        })) as ChatMessage[];
        callback(messages);
      },
      error: (err) => {
        console.error('subscribeToMessages listener error:', err);
      },
    }
  );
};

// Get messages for a conversation (one-time fetch)
export const getConversationMessages = async (conversationId: string): Promise<ChatMessage[]> => {
  try {
    const q = query(
      collection(db, 'conversations', conversationId, 'messages'),
      orderBy('timestamp', 'asc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      timestamp: (doc.data().timestamp as Timestamp)?.toDate() || new Date(),
    })) as ChatMessage[];
  } catch (error) {
    console.error('Error getting messages:', error);
    throw error;
  }
};

// Function to create a new conversation with a context-based title
export const createNewConversation = async (userId: string, title: string): Promise<Conversation> => {
  try {
    const newConversation = {
      userId,
      title: title || 'New Conversation', // Use the provided title or a default
      lastMessage: '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'conversations'), newConversation);

    return {
      id: docRef.id,
      ...newConversation,
      createdAt: new Date(), // Replace with actual timestamp if needed
      updatedAt: new Date(),
    };
  } catch (error) {
    console.error('Error creating new conversation:', error);
    throw error;
  }
};
