import cv2
import os
from deepface import DeepFace

def extract_face_from_id_card(id_card_path, output_path):
    """
    Extracts the face from an ID card image and saves it to the specified path.
    """
    try:
        # Load the image
        image = cv2.imread(id_card_path)
        if image is None:
            raise Exception("Unable to load the ID card image.")
        
        # Convert to grayscale for face detection
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        # Load the Haar Cascade for face detection
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

        # Detect faces in the image
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

        if len(faces) == 0:
            raise Exception("No face detected in the ID card image.")

        # Assuming the first detected face is the correct one
        x, y, w, h = faces[0]
        face = image[y:y+h, x:x+w]

        # Save the extracted face
        cv2.imwrite(output_path, face)
        print(f"Face extracted and saved to: {output_path}")
        return output_path
    except Exception as e:
        print(f"Error extracting face: {e}")
        return None

def compare_faces(image1_path, id_card_path):
    """
    Compares a given image with the face extracted from an ID card.
    """
    try:
        # Paths for temporary storage of the extracted face
        extracted_face_path = 'extracted_face.jpg'

        # Extract face from the ID card
        extracted_face = extract_face_from_id_card(id_card_path, extracted_face_path)
        if not extracted_face:
            print("Failed to extract a face from the ID card.")
            return

        # Compare the two images using DeepFace
        result = DeepFace.verify(image1_path, extracted_face_path, enforce_detection=True)
        similarity_score = result['distance']
        threshold = result['threshold']

        print(f"Similarity Score: {similarity_score}")
        print(f"Threshold: {threshold}")

        if result['verified']:
            print("The face in the image matches the face on the ID card!")
        else:
            print("The face in the image does NOT match the face on the ID card.")
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        # Clean up temporary file
        if os.path.exists(extracted_face_path):
            os.remove(extracted_face_path)

# Example usage
image1 = "./test_images/1.jpg"  # Replace with the path to the user's image
id_card_image = "./test_images/CIN.jpg"  # Replace with the path to the ID card

compare_faces(image1, id_card_image)

