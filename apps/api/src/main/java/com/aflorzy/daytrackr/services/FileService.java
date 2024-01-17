package com.aflorzy.daytrackr.services;

import com.aflorzy.daytrackr.domain.FileEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FileService {

    public List<FileEntity> convertMultipartFilesToEntities(List<MultipartFile> multipartFiles) {
        return multipartFiles.stream()
                .map(this::convertMultipartFileToEntity)
                .collect(Collectors.toList());
    }

    private FileEntity convertMultipartFileToEntity(MultipartFile multipartFile) {
        try {
            FileEntity fileEntity = new FileEntity();
            fileEntity.setFileName(multipartFile.getOriginalFilename());
            fileEntity.setFileType(multipartFile.getContentType());
            fileEntity.setData(multipartFile.getBytes());
            return fileEntity;
        } catch (IOException e) {
            // Handle the exception according to your application's requirements
            e.printStackTrace();
            return null;
        }
    }
}