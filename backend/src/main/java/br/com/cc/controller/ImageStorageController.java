package br.com.cc.controller;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;

import br.com.cc.entity.ImageStorage;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/ccimages")
public class ImageStorageController {

    private final Path imageStorageLocation;

    public ImageStorageController(ImageStorage imageStorage) {
        this.imageStorageLocation = Paths.get(imageStorage.getUploadDir())
                .toAbsolutePath().normalize();
    }


    @PostMapping("/upload")
    public ResponseEntity<String> uploadImage(@RequestParam("image") MultipartFile image) {
        String imageName = StringUtils.cleanPath(image.getOriginalFilename());

        try {
            Path targetLocation = imageStorageLocation.resolve(imageName);
            image.transferTo(targetLocation);

            String imageDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/api/ccimages/download/")
                    .path(imageName)
                    .toUriString();

            return ResponseEntity.ok("Imagem salva com sucesso. Link para download: " + imageDownloadUri);
        } catch (IOException ex) {
            ex.printStackTrace();
            return ResponseEntity.badRequest().body("Falha no envio da imagem.");
        }
    }

    @GetMapping("/download/{imageName:.+}")
    public ResponseEntity<Resource> downloadImage(@PathVariable String imageName,
                                                 HttpServletRequest request) throws IOException {
        Path imagePath = imageStorageLocation.resolve(imageName).normalize();
        try {
            Resource resource = new UrlResource(imagePath.toUri());

            String contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; imagename=\"" + resource.getFilename() + "\"")
                    .body(resource);
        } catch (MalformedURLException ex) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/list")
    public ResponseEntity<List<String>> listImages() throws IOException {
        List<String> imageNames = Files.list(imageStorageLocation)
                .map(Path::getFileName)
                .map(Path::toString)
                .collect(Collectors.toList());

        return ResponseEntity.ok(imageNames);
    }
}