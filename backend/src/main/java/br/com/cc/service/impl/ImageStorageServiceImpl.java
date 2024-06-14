package br.com.cc.service.impl;

import br.com.cc.entity.ImageStorage;
import br.com.cc.service.ImageStorageService;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class ImageStorageServiceImpl  implements ImageStorageService {

    private final Path imageStorageLocation;

    public ImageStorageServiceImpl(ImageStorage imageStorage) {
        this.imageStorageLocation = Paths.get(imageStorage.getUploadDir())
                .toAbsolutePath().normalize();
    }

    @Override
    public String uploadImage(MultipartFile image) throws IOException {
        String imageName = StringUtils.cleanPath(image.getOriginalFilename());

        try {
            Path targetLocation = imageStorageLocation.resolve(imageName);
            image.transferTo(targetLocation);

        return ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/ccimages/download/")
                .path(imageName)
                .toUriString();

        } catch (IOException ex) {
            ex.printStackTrace();
            return "Falha no envio da imagem.";
        }
    }

    public void deleteImage(String imageName) throws IOException {
        Path filePath = imageStorageLocation.resolve(imageName).normalize();
        Files.deleteIfExists(filePath);
    }
}
