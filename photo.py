from PIL import Image

def crop_logo(image_path):
    img = Image.open(image_path)
    cropped_img = img.crop((500,270,1400,850))
    return cropped_img
crop_logo('img/logo.png').save('cropped_logo.png')
