package br.com.cc.service.impl;

import br.com.cc.entity.ImageStorage;
import br.com.cc.service.ImageStorageService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
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
        Path targetLocation = imageStorageLocation.resolve(imageName);
        image.transferTo(targetLocation);

        return ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/ccimages/download/")
                .path(imageName)
                .toUriString();
    }


//    public ResponseEntity<String> uploadImage(@RequestParam("image") MultipartFile image) {
//        String imageName = StringUtils.cleanPath(image.getOriginalFilename());
//
//        try {
//            Path targetLocation = imageStorageLocation.resolve(imageName);
//            image.transferTo(targetLocation);
//
//            String imageDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
//                    .path("/api/ccimages/download/")
//                    .path(imageName)
//                    .toUriString();
//
//            return ResponseEntity.ok("Imagem salva com sucesso. Link para download: " + imageDownloadUri);
//        } catch (IOException ex) {
//            ex.printStackTrace();
//            return ResponseEntity.badRequest().body("Falha no envio da imagem.");
//        }
//    }

}