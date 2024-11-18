import cv2

def extract_face_from_id(image_path, output_path='extracted_face.jpg'):
    # Charger l'image d'identité
    img = cv2.imread(image_path)
    
    # Vérifier que l'image a été correctement chargée
    if img is None:
        print("L'image n'a pas pu être chargée. Vérifiez le chemin d'accès.")
        return None

    # Convertir l'image en niveaux de gris (nécessaire pour la détection)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Charger le modèle de détection de visage (Haar Cascade)
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    
    # Détecter les visages dans l'image
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(100, 100))

    # Vérifier si un visage a été détecté
    if len(faces) == 0:
        print("Aucun visage détecté dans l'image.")
        return None

    # Extraire le premier visage détecté (le plus probable)
    for (x, y, w, h) in faces:
        face = img[y:y+h, x:x+w]
        
        # Sauvegarder le visage extrait
        cv2.imwrite(output_path, face)
        print(f"Le visage a été extrait et sauvegardé dans {output_path}")
        return output_path

    return None

# Exemple d'utilisation
image_path = r'./inversecarte.png'  # Remplacez par le chemin vers votre image d'identité
output_path = 'extracted_face1.jpg'         # Chemin pour sauvegarder le visage extrait

extracted_face_path = extract_face_from_id(image_path, output_path)
if extracted_face_path:
    print("Extraction réussie !")
else:
    print("Extraction échouée.")
