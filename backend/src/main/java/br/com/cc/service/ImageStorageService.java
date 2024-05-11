package br.com.cc.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface ImageStorageService {

     String uploadImage(MultipartFile image) throws IOException;

}
