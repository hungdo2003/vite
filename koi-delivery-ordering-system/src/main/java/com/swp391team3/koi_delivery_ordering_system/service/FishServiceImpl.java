package com.swp391team3.koi_delivery_ordering_system.service;

import com.swp391team3.koi_delivery_ordering_system.model.*;
import com.swp391team3.koi_delivery_ordering_system.repository.*;
import com.swp391team3.koi_delivery_ordering_system.requestDto.OrderFishInfoRequestDTO;
import com.swp391team3.koi_delivery_ordering_system.utils.FishStatus;
import com.swp391team3.koi_delivery_ordering_system.utils.OrderStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FishServiceImpl implements IFishService {
    private final FishRepository fishRepository;
    private final OrderRepository orderRepository;
    private final IFileService fileService;
    private final FishStatus fishStatus;
    private final LicenseRepository licenseRepository;
    private final LicenseFileRepository licenseFileRepository;
    private final FileRepository fileRepository;
    private final OrderStatus orderStatus;

    @Override
    public List<Fish> getAllFishs() {
        return fishRepository.findAll();
    }

    @Override
    public Optional<Fish> getFishById(Long id) {
        return fishRepository.findById(id);
    }

    @Override
    public boolean deleteFishById(Long id) {
        boolean result = false;
        Fish fish = fishRepository.findById(id)
                .orElse(null);
        if (fish != null) {
            Set<License> licenses = fish.getLicenses();
            if (licenses != null) {
                for (License license : licenses) {
                    Set<LicenseFile> licenseFiles = licenseFileRepository.findAll().stream()
                            .filter(licenseFile1 -> licenseFile1.getLicense().equals(license))
                            .collect(Collectors.toSet());
                    if (licenseFiles != null) {
                        for (LicenseFile licenseFile : licenseFiles) {
                            Long licenseFileId = licenseFile.getFile().getId();
                            fileService.deleteFile(licenseFileId);
                        }
                        licenseFileRepository.deleteAll(licenseFiles);
                    }
                    licenseRepository.delete(license);
                }
            }
            fishRepository.delete(fish);
            if (fish.getFile() != null) {
                fileRepository.delete(fish.getFile());
                fileService.deleteFile(fish.getFile().getId());
            }
            result = true;
        }
        return result;
    }

    @Override
    public Long createFishByOrderId(OrderFishInfoRequestDTO request) throws IOException {
        try {
            Fish newFish = new Fish();
            File uploadedFile = fileService.uploadFileToFileSystem(request.getFishImage());
            Optional<Order> foundedOrder = orderRepository.findById(request.getOrderId());
            newFish.setName(request.getFishName());
            newFish.setOrder(foundedOrder.get());
            newFish.setPrice(request.getFishPrice());
            newFish.setFile(uploadedFile);
            newFish.setAge(request.getFishAge());
            newFish.setSize(request.getFishSize());
            newFish.setWeight(request.getFishWeight());
            newFish.setLicenses(null);
            newFish.setStatus(fishStatus.GOOD);
            fishRepository.save(newFish);
            foundedOrder.get().setOrderStatus(orderStatus.DRAFT);
            orderRepository.save(foundedOrder.get());
            return newFish.getId();
        } catch (Exception e) {
            System.out.println(e);
            return 0L;
        }
    }

    @Override
    public List<Fish> getFishesByOrderId(Long orderId) {
        try {
            return fishRepository.findFishesByOrderId(orderId);
        } catch (Exception e) {
            return null;
        }
    }

//    @Override
//    public Fish updateFish(Long fishId, String name, int age, double size, double weight, double price, MultipartFile file) {
//
//        Fish fish = fishRepository.findById(fishId)
//                .orElseThrow(() -> new RuntimeException("Fish not found"));
//        try {
//            if (file != null) {
//                fileService.updateFileInFileSystem(fish.getFile().getId(), file);
//            }
//        } catch (IOException e) {
//            throw new RuntimeException(e);
//        }
//
//        fish.setName(name);
//        fish.setAge(age);
//        fish.setSize(size);
//        fish.setWeight(weight);
//        fish.setPrice(price);
//        return fishRepository.save(fish);
//    }

    @Override
    public boolean updateFishStatus(Long id, int status) {
        Optional<Fish> foundedFish = getFishById(id);
        if (foundedFish.isPresent()) {
            foundedFish.get().setStatus(status);
            fishRepository.save(foundedFish.get());
            return true;
        }
        return false;
    }
}
