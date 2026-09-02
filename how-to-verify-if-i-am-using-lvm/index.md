# How to verify if I am using LVM ?

- Canonical URL: https://leandeep.com/how-to-verify-if-i-am-using-lvm/
- Author: Olivier Eeckhoutte
- Published: 2024-06-05T20:28:00Z
- Updated: 2024-06-05T20:28:00Z
- Language: fr
- Tags: tips, Linux
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)


Simply use the following command:
```
cat /etc/fstab
```

And have a look at the line with your root filesystem.

From there we have 3 possibilities:

- If the line starts with UUID=xyz, then it means it is a physical partition.
- If the line starts with /dev/sdaX, it is a physical partition.
- The indicator for LVM would be something with /dev/mapper/xyz.

<br/>

You can also check in the mounts and fstab using this command:

```
if  grep -Pq '/dev/(mapper/|disk/by-id/dm)' /etc/fstab  ||  mount | grep -q /dev/mapper/
then
    echo "LVM in use"
fi
```
