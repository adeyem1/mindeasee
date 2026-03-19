# MindEase Chat API Documentation

## Overview

The MindEase Chat API provides a secure interface for communication between the client application and the AI-powered chat assistant. This API enables real-time mental health support through natural language processing and therapeutic response generation.

## Base URL

```
https://api.mindease.com/v1
```

## Authentication

All API requests require authentication using a JSON Web Token (JWT). Include the token in the Authorization header:

```
Authorization: Bearer {YOUR_JWT_TOKEN}
```

Tokens can be obtained through the authentication endpoints (see Auth API documentation).

## Endpoints

### Start a new chat session

```
POST /chat/session
```

Initializes a new chat session with the AI assistant.

**Request Body:** None required

**Response:**

```json
{
  "session_id": "chat_sess_123456789",
  "created_at": "2023-11-15T14:30:00Z",
  "expiry": "2023-11-16T14:30:00Z"
}
```

### Send a message

```
POST /chat/message
```

Sends a new message to the AI assistant.

**Request Body:**

```json
{
  "session_id": "chat_sess_123456789",
  "message": "I've been feeling anxious lately and can't sleep well.",
  "context": {
    "previous_messages": 3,
    "include_metadata": true
  }
}
```

**Response:**

```json
{
  "message_id": "msg_987654321",
  "timestamp": "2023-11-15T14:35:10Z",
  "response": "I understand that anxiety can make it difficult to sleep. Let's explore what might be causing these feelings and some techniques that could help you. Could you share more about when your anxiety tends to peak?",
  "suggestions": [
    "During the day",
    "At night before bed",
    "When thinking about work",
    "Randomly throughout the day"
  ],
  "resources": [
    {
      "id": "res_123",
      "type": "article",
      "title": "Managing Nighttime Anxiety",
      "url": "/resources/managing-nighttime-anxiety"
    }
  ],
  "sentiment": {
    "detected_emotions": ["anxiety", "insomnia"],
    "severity_level": "moderate"
  }
}
```

### Retrieve chat history

```
GET /chat/history/{session_id}
```

Retrieves the message history for a specific chat session.

**Path Parameters:**
- `session_id`: The ID of the chat session

**Query Parameters:**
- `limit` (optional): Maximum number of messages to return (default: 50)
- `before` (optional): Timestamp to retrieve messages before this time
- `include_metadata` (optional): Whether to include metadata in the response (default: false)

**Response:**

```json
{
  "session_id": "chat_sess_123456789",
  "message_count": 8,
  "messages": [
    {
      "message_id": "msg_123456700",
      "timestamp": "2023-11-15T14:30:10Z",
      "sender": "system",
      "content": "Welcome to MindEase. I'm here to support you with your mental health needs. How are you feeling today?",
      "metadata": {}
    },
    {
      "message_id": "msg_123456701",
      "timestamp": "2023-11-15T14:31:05Z",
      "sender": "user",
      "content": "I've been feeling anxious lately and can't sleep well.",
      "metadata": {}
    },
    {
      "message_id": "msg_123456702",
      "timestamp": "2023-11-15T14:31:15Z",
      "sender": "assistant",
      "content": "I understand that anxiety can make it difficult to sleep. Let's explore what might be causing these feelings and some techniques that could help you. Could you share more about when your anxiety tends to peak?",
      "metadata": {
        "sentiment": {
          "detected_emotions": ["anxiety", "insomnia"],
          "severity_level": "moderate"
        },
        "suggestions": [
          "During the day",
          "At night before bed",
          "When thinking about work",
          "Randomly throughout the day"
        ]
      }
    }
    // Additional messages...
  ]
}
```

### End a chat session

```
POST /chat/session/{session_id}/end
```

Ends an active chat session.

**Path Parameters:**
- `session_id`: The ID of the chat session to end

**Request Body:** None required

**Response:**

```json
{
  "session_id": "chat_sess_123456789",
  "status": "ended",
  "ended_at": "2023-11-15T15:45:22Z",
  "duration_seconds": 4522
}
```

### Rate a response

```
POST /chat/message/{message_id}/rate
```

Provides feedback on an AI assistant's response.

**Path Parameters:**
- `message_id`: The ID of the message to rate

**Request Body:**

```json
{
  "rating": 4,
  "feedback": "This was very helpful for my anxiety",
  "tags": ["helpful", "compassionate", "practical"]
}
```

**Response:**

```json
{
  "message_id": "msg_987654321",
  "rating_recorded": true,
  "thank_you_message": "Thank you for your feedback! It helps us improve."
}
```

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

## Rate Limiting

API requests are limited to 60 requests per minute per user. When the rate limit is exceeded, the API will return a 429 error.

## Data Retention

Chat history is retained for 90 days by default. Users can request data deletion at any time through the profile settings.

## Implementation Notes

### Client-side Integration

The API is designed to be used with the MindEase client applications. For web applications, we recommend using the provided `aiService.ts` utilities which handle authentication, request formatting, and error handling.

Example usage with the service:

```typescript
import { sendChatMessage } from '../services/aiService';

// In a React component
const handleSendMessage = async (message: string) => {
  try {
    const response = await sendChatMessage(sessionId, message);
    // Handle the response...
  } catch (error) {
    // Handle errors...
  }
};
```

### Security Considerations

1. All API requests must use HTTPS
2. JWT tokens expire after 24 hours
3. Sensitive mental health data is encrypted at rest
4. No PII is stored with chat content unless explicitly provided by the user

## Webhook Integration

For enterprise clients, we offer webhook notifications when:
- A user completes a session
- A high-risk situation is detected
- A user shares critical mental health information

Contact enterprise support for webhook setup instructions.

## Support

For API support, contact api-support@mindease.com or visit the developer portal at https://developers.mindease.com.
