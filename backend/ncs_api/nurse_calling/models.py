from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
import uuid

def generate_uuid():
    return str(uuid.uuid4())

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("role", "admin")

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('supervisor', 'Supervisor'),
        ('nurse', 'Nurse'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    email = models.EmailField(unique=True)

    groups = models.ManyToManyField(
        'auth.Group',
        related_name='nurse_users',
        related_query_name='nurse_user',
        blank=True,
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='nurse_users_permissions',
        related_query_name='nurse_user_permission',
        blank=True,
    )


class Hospital(models.Model):
    id = models.CharField(primary_key=True, max_length=100, default=generate_uuid, editable=False)
    name = models.CharField(max_length=255)
    address = models.TextField()
    admin = models.OneToOneField("Nurse", on_delete=models.SET_NULL, null=True, blank=True, related_name="managed_hospital")

    def __str__(self):
        return self.name


class Building(models.Model):
    id = models.CharField(primary_key=True, max_length=100, default=generate_uuid, editable=False)
    name = models.CharField(max_length=255)
    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE)
    building_manager = models.OneToOneField("Nurse", on_delete=models.SET_NULL, null=True, blank=True, related_name="building_manager")

    def __str__(self):
        return self.name


class Floor(models.Model):
    id = models.CharField(primary_key=True, max_length=100, default=generate_uuid, editable=False)
    number = models.IntegerField()
    building = models.ForeignKey(Building, on_delete=models.CASCADE)
    floor_manager = models.OneToOneField("Nurse", on_delete=models.SET_NULL, null=True, blank=True, related_name="floor_manager")

    def __str__(self):
        return f"Floor {self.number} - {self.building.name}"


class Ward(models.Model):
    id = models.CharField(primary_key=True, max_length=100, default=generate_uuid, editable=False)
    name = models.CharField(max_length=255)
    floor = models.ForeignKey(Floor, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class Bed(models.Model):
    id = models.CharField(primary_key=True, max_length=100, default=generate_uuid, editable=False)
    number = models.CharField(max_length=50)
    ward = models.ForeignKey(Ward, on_delete=models.CASCADE)
    nurses = models.ManyToManyField("Nurse", related_name="assigned_beds")

    def __str__(self):
        return f"Bed {self.number}"


class Device(models.Model):
    id = models.CharField(primary_key=True, max_length=100, default=generate_uuid, editable=False)
    serial_number = models.CharField(max_length=100)
    bed = models.ForeignKey(Bed, on_delete=models.CASCADE)

    def __str__(self):
        return self.serial_number


class StaffTeam(models.Model):
    id = models.CharField(primary_key=True, max_length=100, default=generate_uuid, editable=False)
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Nurse(models.Model):
    id = models.CharField(primary_key=True, max_length=100, default=generate_uuid, editable=False)
    team = models.ForeignKey(StaffTeam, on_delete=models.CASCADE)
    nurse_id = models.CharField(max_length=100)
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class TeamAssignment(models.Model):
    id = models.CharField(primary_key=True, max_length=100, default=generate_uuid, editable=False)
    ward = models.ForeignKey(Ward, on_delete=models.CASCADE)
    floor = models.ForeignKey(Floor, on_delete=models.CASCADE)
    team = models.ForeignKey(StaffTeam, on_delete=models.CASCADE)


class Call(models.Model):
    id = models.CharField(primary_key=True, max_length=100, default=generate_uuid, editable=False)
    device = models.ForeignKey(Device, on_delete=models.CASCADE)
    bed = models.ForeignKey(Bed, on_delete=models.CASCADE)
    call_time = models.DateTimeField()
    status = models.CharField(max_length=50)
    response_time = models.DateTimeField(null=True, blank=True)
    nurse = models.ForeignKey(Nurse, on_delete=models.SET_NULL, null=True)


class Patient(models.Model):
    id = models.CharField(primary_key=True, max_length=100, default=generate_uuid, editable=False)
    name = models.CharField(max_length=255)
    age = models.PositiveIntegerField()
    gender = models.CharField(max_length=10)
    bed = models.OneToOneField(Bed, on_delete=models.SET_NULL, null=True, blank=True, related_name="patient")

    def __str__(self):
        return self.name