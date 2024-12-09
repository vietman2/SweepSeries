from django.db import models

class Sido(models.Model):
    sido_code = models.PositiveBigIntegerField(primary_key=True)
    sido_name = models.CharField(max_length=20)
    label     = models.CharField(max_length=2)
    display   = models.CharField(max_length=4)

    objects = models.Manager()

    class Meta:
        db_table = "sido"

class SigunguManager(models.Manager):
    def get_sigungu_from_bcode(self, bcode):
        ## leave the first 5 digits and replace the rest with 0s
        sigungu_code = int(bcode[:5] + "00000")
        sigungu = self.get(sigungu_code=sigungu_code)

        return sigungu

class Sigungu(models.Model):
    sigungu_code    = models.PositiveBigIntegerField(primary_key=True)
    sigungu_name    = models.CharField(max_length=20)
    sido            = models.ForeignKey("Sido", on_delete=models.CASCADE)

    objects = SigunguManager()

    def get_display_name(self):
        return f"{self.sido.display} {self.sigungu_name}"

    class Meta:
        db_table = "sigungu"

class Address(models.Model):
    # 주소
    region              = models.ForeignKey(Sigungu, on_delete=models.PROTECT)
    road_address_part1  = models.CharField(max_length=30)
    road_address_part2  = models.CharField(max_length=30)
    building_name       = models.CharField(max_length=30)
    eng_address         = models.CharField(max_length=80)
    jibun_address       = models.CharField(max_length=50)
    zip_code            = models.CharField(max_length=5)

    # 좌표
    longitude           = models.DecimalField(max_digits=10, decimal_places=7)
    latitude            = models.DecimalField(max_digits=10, decimal_places=7)

    # 지도 이미지
    map_image           = models.ImageField(blank=True)

    objects = models.Manager()

    class Meta:
        db_table = "address"
        unique_together = [["road_address_part1", "road_address_part2"]]
