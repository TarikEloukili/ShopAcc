from deepface import DeepFace
import cv2
import os

def extract_face_from_id_card(id_card_path, output_path):
    """
    Extracts the face from an ID card image and saves it to the specified path.
    Returns the path to the extracted face or None if extraction fails.
    """
    try:
        image = cv2.imread(id_card_path)
        if image is None:
            raise Exception("Unable to load the ID card image.")
        
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

        if len(faces) == 0:
            raise Exception("No face detected in the ID card image.")

        x, y, w, h = faces[0]
        face = image[y:y+h, x:x+w]
        cv2.imwrite(output_path, face)
        
        return output_path
    except Exception as e:
        print(f"Error extracting face: {e}")
        return None

def verify_identity(selfie_path, id_card_path):
    """
    Verifies if the face in the selfie matches the face in the ID card.
    Returns a dictionary with verification results.
    """
    try:
        temp_dir = os.path.dirname(selfie_path)
        extracted_face_path = os.path.join(temp_dir, 'extracted_face.jpg')

        extracted_face = extract_face_from_id_card(id_card_path, extracted_face_path)
        if not extracted_face:
            return {
                'verified': False,
                'message': 'Failed to extract face from ID card',
                'error': True
            }

        result = DeepFace.verify(
            selfie_path,
            extracted_face_path,
            enforce_detection=True,
            model_name='VGG-Face'
        )

        return {
            'verified': result['verified'],
            'confidence': 1 - result['distance'],
            'threshold': result['threshold'],
            'message': 'Identity verified successfully!' if result['verified'] else 'Verification failed. Please try again.',
            'error': False
        }

    except Exception as e:
        return {
            'verified': False,
            'message': f'Error during verification: {str(e)}',
            'error': True
        }
    finally:
        if os.path.exists(extracted_face_path):
            os.remove(extracted_face_path)