# from rest_framework import permissions

# class IsOwnerOrReadOnly(permissions.BasePermission):
# 	def has_object_permission(self, request, view, obj):
# 		#read permissions are allowed to any request,
# 		#so we'll always allow GET, HEAD, or OPTIONS requests
# 		if request.method in permissions.SAFE_METHODS:
# 			return True
# 		elif request.user.is_staff:	
# 			return True
# 		#write permissions are only allowed	to the owner of the meeting
# 		return obj.created_by == request.user
		
# class IsOwnerOrRead(permissions.BasePermission):
# 	def has_object_permission(self, request, view, obj):
# 		#read permissions are allowed to any request,
# 		#so we'll always allow GET, HEAD, or OPTIONS requests
# 		if request.method in permissions.SAFE_METHODS:
# 			return True

# 		#write permissions are only allowed	to the owner of the meeting
# 		return obj.user == request.user

# class IsStaff(permissions.BasePermission):
# 	def get_permission(self, request, view):
# 		#read permissions are allowed to any request,
# 		#so we'll always allow GET, HEAD, or OPTIONS requests
# 		if request.user.is_staff:
# 			return False
			
# 		return obj.created_by == request.user

# 		#write permissions are only allowed	to the owner of the meeting
# 	